import React, { useContext, useState , useEffect, useRef} from 'react'
import Navbar from '../components/Navbar'
import { userDataContext } from "../context/CurrentUserContext.jsx"
import { IoIosCamera } from "react-icons/io";
import profileImg from "../assets/profileImg.webp"
import { FaPlus } from "react-icons/fa6";
import { MdOutlineModeEditOutline } from "react-icons/md";
import EditProfile from '../components/EditProfile.jsx';
import CreatePostPopup from '../components/CreatePostPopup.jsx';
import Posts from '../components/Posts.jsx';
import { authDataContext } from '../context/AuthContext.jsx';
import axios from 'axios';
import ConnectionBtn from '../components/ConnectionBtn.jsx';


function Home() {
  const {serverURL} = useContext(authDataContext)
  let {userData, setUserData, editUser, setEditUser, postPopup, setPostPopup, posts, setPosts, getAllPosts, handleGetUserProfile, skipPost,setSkipPost, limit, hasMore} = useContext(userDataContext)
  let [suggestedUsers, setSuggestedUsers] = useState([])
  const observer = useRef()
  const [loadingPosts, setLoadingPosts] = useState(false)
  let [isLargeScreen,setIsLargeScreen] = useState(false)

  let handleSuggestedUsers = async()=>{
    try{
      let result  = await axios.get(serverURL+`/api/user/suggestedusers`, {withCredentials:true})
      setSuggestedUsers(result.data)
    }
    catch(error){
      console.log(error)
    }
  }


  const lastPostRef = (node) => {
    if (!node) return

    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loadingPosts && hasMore) {
        // load more posts
        setLoadingPosts(true)
        let newSkip = skipPost + limit
        setSkipPost(newSkip)
        getAllPosts(newSkip)
        .finally(() => {
          setLoadingPosts(false)
        })
      }
  })

  observer.current.observe(node)
}

  useEffect(()=>{
    getAllPosts(),
    handleSuggestedUsers()
  }, [])

  return <div className='min-h-screen  bg-gray-200 flex justify-center' >
    <Navbar />
    {editUser && <EditProfile />}
    {/* Home */}
    <div className='flex flex-col lg:flex-row gap-[10px] px-[10px] pt-[70px] w-full lg:max-w-[1440px]'>
      {/* left part of home */}
      <div className='w-full lg:w-[25%] bg-white rounded p-[10px] lg:sticky top-18 self-start'>
        <div className='bg-gray-400 h-[110px] rounded-lg cursor-pointer' >
          {userData?.coverImage && <img src={userData.coverImage} alt="cover image"  className='w-[100%] h-[100%] rounded-lg'/>}
          <IoIosCamera className='h-[25px] w-[25px] absolute top-3 right-4 text-white' />
        </div>
        <div className='rounded-full bg-blue-200 h-[50px] w-[50px]  flex justify-center items-center cursor-pointer  absolute top-[90px] left-6'>
            <img src={ userData?.profileImage || profileImg} alt='profile image' className='rounded-full w-[100%] h-[100%]'/>
        </div>
        <div className='rounded-full bg-blue-400 w-[20px] h-[20px] flex justify-center items-center absolute top-[118px] left-16 cursor-pointer'>
          <FaPlus className='text-white' />
        </div>
        <div className='py-[20px] px-[15px]'>
          <div className='font-semibold'>
            {userData.username}
          </div>
          <div className='text-gray-600 '>
            {userData.headline}
          </div>
          <div className='text-gray-600 text-[15px]'>
            {userData.location}
          </div>
        </div>
        <div className='w-full border-2 border-blue-400 text-blue-400 text-center p-[5px] rounded-full cursor-pointer flex justify-center gap-[5px] items-center' onClick={()=> setEditUser(!editUser)}>
          <button className='cursor-pointer'>Edit Profile</button>
          <MdOutlineModeEditOutline className='cursor-pointer' />
        </div>
      </div>

      {/* main part of home */}
      {postPopup && <CreatePostPopup />}
      <div className='w-full flex flex-col gap-[20px] pb-[10px] lg:w-[50%] rounded overflow-y-auto overflow-x-hidden'>
        
        <div className='flex items-center justify-center gap-4 bg-white p-4 rounded'>
          <div className='rounded-full  flex justify-center items-center cursor-pointer'>
              <img src={userData.profileImage? userData.profileImage : profileImg} alt='profile image' className='h-[55px] w-[55px] rounded-full'/>
          </div>
          <div className='w-full lg:max-w-[400px] border-2 p-3 rounded-full cursor-pointer' onClick={()=> setPostPopup(!postPopup)}>
            Start Post
          </div>
        </div>


        {!isLargeScreen && posts && posts.map((post, i)=>{
          return <Posts key={i} index={i} post={post} />
        })}

        {!isLargeScreen && hasMore && <div className='w-full flex justify-center font-semibold' onClick={()=> {
          let newSkipPostValue = skipPost + limit
          setSkipPost(newSkipPostValue)
          getAllPosts(newSkipPostValue)
        }}>
          <button className='w-full cursor-pointer py-2 my-[10px] md:max-w-[200px] bg-white rounded-full hover:bg-gray-300'>Click Load more...</button>
        </div>}

        
      </div>


      {/* {right part of the home} */}
      <div className='w-full lg:w-[25%] bg-white rounded h-[300px] p-[10px] lg:sticky top-18 self-start'>
        <h1 className='text-gray-600 font-bold'>Suggested Users</h1>
        <div className='flex flex-col gap-[10px] mt-[15px]'>
          {suggestedUsers.map((user, index)=>{
            return  <div key={index} className='flex flex-wrap sm:flex-nowrap justify-between items-start gap-[10px hover:bg-gray-200 rounded-lg p-[5px]'>
                <div className='flex gap-2 items-start'>
                    <div className='rounded-full  flex justify-center items-center cursor-pointer' onClick={()=> handleGetUserProfile(user._id) }>
                        <img src={user.profileImage ? user.profileImage : profileImg} alt='profile image' className='h-[50px] w-[50px] rounded-full'/>
                    </div>
                    <div >
                        <div className='font-bold'>{user.username}</div>
                        <div className='text-gray-600 text-[14px]'>{user.headline}</div>
                    </div>
                </div>
                <ConnectionBtn userId={user._id} customeStyle={"px-[5px] py-[2px]"} />
              </div>
          })}
        </div>


      </div>
    </div>
  </div>
}

export default Home