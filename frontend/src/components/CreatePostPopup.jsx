import React, { useContext, useRef, useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import { userDataContext } from '../context/CurrentUserContext.jsx';
import profileImg from "../assets/profileImg.webp"
import { GoFileMedia } from "react-icons/go";
import axios from 'axios';
import { authDataContext } from '../context/AuthContext.jsx';
import { useEffect } from 'react';

function CreatePostPopup() {
    let {serverURL} = useContext(authDataContext)
    let {userData, setUserData, postPopup, setPostPopup,  loading, setLoading, posts, setPosts, getAllPosts} = useContext(userDataContext)
    let postMedia = useRef(null)
    let [description, setDescription] = useState("")

    let [file, setFile] = useState("")
    let [fileType, setFileType] = useState("")

    let [backendImage, setBackendImage] = useState("")
    let [frontendImage, setFrontendImage] = useState("")
    let [backendVideo, setBackendVideo] = useState("")
    let [frontendVideo, setFrontendVideo] = useState("")


    let handleFile = (e)=>{
        let selectedFile = e.target.files[0]
        if(!selectedFile){
            return 
        }
        setFile(selectedFile)
        
        if(selectedFile.type.startsWith("image/")){
            handleFrontendImage(selectedFile)
            setBackendImage(selectedFile)
            setFileType("image")
        }
        if(selectedFile.type.startsWith("video/")){
            handleFrontendVideo(selectedFile)
            setBackendVideo(selectedFile)
            setFileType("video")
        }
    }

    let handleFrontendImage = (file)=>{
        setFrontendImage(URL.createObjectURL(file))
    }

    let handleFrontendVideo = (file)=>{
        setFrontendVideo(URL.createObjectURL(file))
    }

    const handlePost = async()=>{
        try{
            setLoading(true)
            let formdata = new FormData()
            formdata.append("description", description)
            formdata.append("image", backendImage)
            formdata.append('video', backendVideo)

            let result = await axios.post(serverURL+"/api/post/createpost", formdata, {withCredentials:true})
            setPosts(prevposts=> [...prevposts, result.data])
            getAllPosts()
            setLoading(false)
            setPostPopup(false)
            // setDescription("")
            // setBackendImage("")
            // setFrontendImage("")

        }
        catch(error){
            setLoading(false)
            setPostPopup(false)
            console.log("Error in handle post = ", error)
        }
    }

  return <div className='w-full h-screen fixed top-0 right-0 z-200 flex items-center justify-center px-[10px]'>
    <div className='fixed top-0 right-0  w-full h-screen bg-black opacity-[0.5] z-300'></div>
    <div className='w-full h-[500px] md:max-w-[500px]  bg-white p-4 rounded-md relative z-400 flex flex-col gap-[5px]'>
        <div className='absolute top-4 right-4 flex justify-end items-center'>
            <RxCross2 className='font-bold h-[20px] w-[20px] cursor-pointer' onClick={()=> {setPostPopup(!postPopup)}} />
        </div>
        <div className='flex gap-[15px] items-center'>
            <div className='rounded-full  flex justify-center items-center cursor-pointer'>
                <img src={userData.profileImage? userData.profileImage : profileImg} alt='profile image' className='h-[50px] w-[50px] rounded-full'/>
            </div>
            <div className='font-bold text-center'>{userData?.username}</div>
        </div>
        <div className='mt-[18px]'>
            <textarea value={description} className={`${file ? "h-[100px]" :"h-[300px]"} resize-none w-full  bg-pink-200 outline-none`} onChange={(e)=> setDescription(e.target.value)}></textarea>
        </div>
        <input type="file" accept='image/*, video/*' hidden ref={postMedia} onChange={handleFile}/> 
        {file && <div className='w-full h-[200px]'>
            {fileType=="image" && <img src={frontendImage ? frontendImage : profileImg} className=' w-full h-full rounded-lg' />}
            {fileType=="video" && <video src={frontendVideo ? frontendVideo : ""} controls className=' w-full h-full rounded-lg'/>}
        </div>}
        <div className='w-full'>
            <GoFileMedia className=' h-[25px] w-[25px] cursor-pointer' onClick={()=> postMedia.current.click()} />
        </div>
        <div className='w-full h-[1px] bg-black'></div>
        <div className='w-full flex justify-end items-center'>
            <button type='button' className={`${loading ? "bg-blue-300" : "bg-blue-400"}  text-white font-bold rounded-full px-6 py-2 cursor-pointer ${loading ? "disabled" : ""}`} onClick={handlePost}>{loading ? <div className="w-10 h-10 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div> : "Post"}</button>
        </div>
    </div>
  </div>
}
export default CreatePostPopup