import React, { useContext, useState } from 'react'
import profileImg from "../assets/profileImg.webp"
import moment from "moment";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegCommentDots, FaS } from "react-icons/fa6";
import { GrLike } from "react-icons/gr";
import { userDataContext } from '../context/CurrentUserContext.jsx';
import axios from 'axios';
import { authDataContext } from '../context/AuthContext.jsx';
import { useEffect } from 'react';
import { BiSolidLike } from "react-icons/bi";
import { IoSend } from "react-icons/io5";
import { useRef } from 'react';
import ConnectionBtn from './ConnectionBtn.jsx';
import { useNavigate } from 'react-router-dom';

import { socket } from '../context/CurrentUserContext.jsx';

function Posts({index, post}) {

    let {serverURL} = useContext(authDataContext)
    let {userData, posts, setPosts, getAllPosts, handleGetUserProfile, profileData, setProfileData} = useContext(userDataContext)
    let navigate = useNavigate("")

    let [readMore, setReadMore] = useState(false)

    let textareaRef = useRef()
    let [isComment, setIsComment] = useState(false)
    let [message, setMessage] = useState("")
    let [likes, setLikes] = useState(0)

    let [skip, setSkip] = useState(0)
    const limit=3 
    let [comments, setComments] = useState([])
    let [loadMore, setLoadMore] = useState(false)
    let [totalComments, setTotalComments] = useState(0)  //how much total comments of this post

    const videoRef = useRef(null)

    const handleLike = async(postId)=>{
        try{
            let result = await axios.get(serverURL + `/api/post/like/${post._id}`, {withCredentials:true})
            {!post.likes.includes(userData._id) && await axios.post(serverURL+`/api/notification/create/${"like"}`, {postId}, {withCredentials:true})}
            setPosts((prevposts)=>{
                return prevposts.map((p)=> p._id === post._id ? result.data : p)
            })
            setLikes(result.data?.likes.length)
        }
        catch(error){
            console.log(error)
        }   
    }


    let handleTextarea = (e)=>{
        const el = textareaRef.current;
        el.style.height = "auto"; // reset height
        el.style.height = el.scrollHeight + "px"; // set new height
    }


    let handleComment = async(postId)=>{
        try{
            let result = await axios.post(serverURL + `/api/post/comment/${post._id}`,{message}, {withCredentials:true})
            let response = await axios.post(serverURL+`/api/notification/create/${"comment"}`, {postId}, {withCredentials:true})
            setPosts((prevposts)=>{
                return prevposts.map((p)=> p._id === post._id ? result.data : p)
            })
            setComments([])
            getComments(0)
            setMessage("")
        }
        catch(error){
            console.log(error)
        }
    }

    let getComments = async(customSkip = skip)=>{
        try{
            let result = await axios.get(serverURL+`/api/post/getcomments/${post._id}?skip=${customSkip}&limit=${limit}`, {withCredentials:true})
            setComments(prevComments => [...prevComments, ...result.data.comments])
            setTotalComments(result.data.totalComments)
            let newSkip = customSkip + limit
            setSkip(newSkip)
            if(newSkip < totalComments){
                setLoadMore(true)
            }else{
                setLoadMore(false)
            }
        }
        catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
        getComments(0)
        setLikes(post.likes.length)

        socket.on("likeUpdated", ({postId, likes})=>{
            if(postId == post._id){
                setLikes(likes.length)
            }
        })

        socket.on("commentsUpdated", ({postId, comments})=>{
            if(postId == post._id){
                setTotalComments(comments.length)
            }
        })

        return ()=>{
            socket.off("likeUpdated")
            socket.off("commentsUpdated")
        }
    }, [post._id])


   useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      const currentVideo = videoRef.current;

      if (!currentVideo) return;

      if (entry.isIntersecting) {
        // ✅ When this video is visible → pause all others
        document.querySelectorAll("video").forEach((vid) => {
          if (vid !== currentVideo) {
            vid.pause();
          }
        });
      } else {
        // ❌ When this video goes out of view → pause it
        currentVideo.pause();
      }
    },
    {
      threshold: 0.5, // 50% visible
    }
  );

  const currentVideo = videoRef.current;

  if (currentVideo) {
    observer.observe(currentVideo);
  }

  return () => {
    if (currentVideo) {
      observer.unobserve(currentVideo);
    }
    observer.disconnect(); // ✅ important cleanup
  };
}, []);

  return <div className='w-full p-4 rounded-md bg-white flex flex-col'>
    <div className='flex flex-wrap justify-between items-start gap'>
        <div className='flex gap-2 items-start'>
            <div className='rounded-full  flex justify-center items-center cursor-pointer' onClick={()=>{ 
                if(post.author._id !== userData._id){
                    handleGetUserProfile(post.author._id)
                }else{
                    setProfileData(null)
                    navigate("/profile")
                }
            }}>
                <img src={post.author?.profileImage ? post.author?.profileImage : profileImg} alt='profile image' className='h-[50px] w-[50px] rounded-full'/>
            </div>
            <div >
                <div className='font-bold'>{post?.author?.username}</div>
                <div className='text-gray-600 text-[14px]'>{post?.author?.headline}</div>
                <div className=' text-gray-600 text-[14px]'>{moment(post.createdAt).fromNow()}</div>
            </div>
        </div>
        {userData._id !== post.author?._id && <ConnectionBtn userId={post.author?._id} customeStyle={"px-[15px] py-[5px] "} />}
    </div>
    <div className=' w-full mt-[10px] overflow-hidden'>
        {!readMore ? (post.description.length < 100) ? post.description : post.description.split(" ").slice(0,15).join(" ")+"..." :  post.description}
    </div>
    {post.description?.length > 100 && <div className='cursor-pointer mt-[10px]' onClick={()=> setReadMore(!readMore)}>{readMore ? "... less": "read more..."}</div>}
    {(post.image || post.video) && <div className="w-full max-h-[300px] bg-black overflow-hidden rounded-lg flex justify-center mt-[10px]">
        {post.image ? (
            <img
            src={post.image}
            alt="post media"
            className="w-full h-auto max-h-[300px] object-contain"
            />
        ) : post.video ? (
            <video
            ref={videoRef}
            src={post.video}
            className="w-full h-auto max-h-[300px] object-contain"
            controls
            />
        ) : null}
    </div>}
    <div className='flex justify-between itmes-center mt-[5px]'>
        <div className='flex gap-[8px] items-center'>
            <AiOutlineLike className='text-blue-600'  />
            <div>{likes}</div>
        </div>
        <div className='flex gap-[8px] items-center'>
            <div>{totalComments}</div>
            <div>commnets</div>
        </div>
    </div>
    <div className='border-gray-400 border-1 my-[10px]'></div>
    <div className='flex gap-[30px] itmes-center'>
        {!post.likes.includes(userData._id) && <div className='flex gap-[8px] items-center cursor-pointer' onClick={()=> handleLike(post._id)}>
            <GrLike className='text-blue-600' />
            <div>Like</div>
        </div>}
        {post.likes.includes(userData._id) && <div className='flex gap-[8px] items-center cursor-pointer' onClick={()=> handleLike(post._id)}>
            <BiSolidLike className='text-blue-600' />
            <div>Liked</div>
        </div>}
        
        <div className='flex gap-[8px] items-center cursor-pointer' onClick={()=> {
            setIsComment(!isComment)
            setComments([])
            setSkip(0)
            getComments(0)
            {comments.length < totalComments ? setLoadMore(true):  setLoadMore(false)}
        }}>
            <FaRegCommentDots />
            <div>Commnet</div>
        </div>
        
    </div>
    <div>
        {isComment && <div className='flex items-end gap-[5px] mt-[10px]'>
            <textarea type="text" ref={textareaRef} value={message}  rows={1} placeholder='write here...' className='outline-none w-full resize-none' onChange={(e)=>{
                    handleTextarea(e)
                    setMessage(e.target.value)
                }} />
            <IoSend className='text-blue-600 h-[23px] w-[23px] cursor-pointer' onClick={()=> handleComment(post._id)} />
        </div>}
        {isComment && <div className='border-1 border-gray-400 mt-[10px]'></div>}
    </div>
    <div className='mt-[15px]'>
        {isComment && comments.map((cmtObj, i)=>{
            return <div key={i} className='pl-[20px] border-b-1 border-gray-400 mb-[10px] pb-[10px]'>
                <div className='flex gap-2 items-start'>
                    <div className='rounded-full  flex justify-center items-center cursor-pointer'>
                        <img src={cmtObj.user.profileImage ? cmtObj.user.profileImage : profileImg} alt='profile image' className='h-[50px] w-[50px] rounded-full'/>
                    </div>
                    <div className='w-full flex justify-between' >
                        <div>
                            <div className='font-bold'>{cmtObj.user?.username}</div>
                            <div className='text-gray-600 text-[14px]'>{cmtObj.user?.headline}</div>
                        </div>
                        <div className=' text-gray-600 text-[14px]'>{moment(cmtObj.createdAt).fromNow()}</div>
                    </div>
                </div>
                <div className='pl-[54px]'>{cmtObj.content}</div>
            </div>
        })}
        {loadMore && isComment && <div onClick={()=>{
            getComments()
        }} className='cursor-pointer pl-[20px]'>Load more...</div>}
    </div>

  </div>
}

export default Posts