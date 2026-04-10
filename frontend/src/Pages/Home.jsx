import React, { useContext, useState } from 'react'
import Navbar from '../components/Navbar'
import { userDataContext } from "../context/CurrentUserContext.jsx"
import { IoIosCamera } from "react-icons/io";
import profileImg from "../assets/profileImg.webp"
import { FaPlus } from "react-icons/fa6";
import { MdOutlineModeEditOutline } from "react-icons/md";
import EditProfile from '../components/EditProfile.jsx';
import CreatePostPopup from '../components/CreatePostPopup.jsx';


function Home() {
  let {userData, setUserData, editUser, setEditUser, postPopup, setPostPopup} = useContext(userDataContext)

  return <div className='h-screen bg-gray-200 flex justify-center' >
    <Navbar />
    {editUser && <EditProfile />}
    <div className='flex flex-col lg:flex-row  gap-[10px] px-[10px] pt-[70px] w-full lg:max-w-[1440px] '>
      {/* //left part of home */}
      <div className='w-full lg:w-[25%] bg-white rounded p-[10px] relative'>
        <div className='bg-gray-400 h-[110px] rounded cursor-pointer' >
          {userData?.coverImage && <img src={userData.coverImage} alt="cover image"  className='w-[100%] h-[100%]'/>}
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
          <div className='text-gray-600'>
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

      {/* //main part of home */}
      {postPopup && <CreatePostPopup />}
      <div className='w-full flex flex-col gap-[20px] lg:w-[50%]  rounded h-full overflow-auto '>
        
        <div className='flex items-center justify-center gap-4 bg-white p-4 rounded'>
          <div className='rounded-full  flex justify-center items-center cursor-pointer'>
              <img src={userData.profileImage? userData.profileImage : profileImg} alt='profile image' className='h-[55px] w-[55px] rounded-full'/>
          </div>
          <div className='w-full lg:max-w-[400px] border-2 p-3 rounded-full cursor-pointer' onClick={()=> setPostPopup(!postPopup)}>
            Start Post
          </div>
        </div>


      </div>
      <div className='w-full lg:w-[25%] bg-white rounded h-[300px]'>eegt</div>
    </div>

  </div>
}

export default Home