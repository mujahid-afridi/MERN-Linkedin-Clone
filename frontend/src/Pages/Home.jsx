import React, { useContext, useState } from 'react'
import Navbar from '../components/Navbar'
import { userDataContext } from "../context/CurrentUserContext.jsx"
import { IoIosCamera } from "react-icons/io";
import profileImg from "../assets/profileImg.webp"
import { FaPlus } from "react-icons/fa6";
import { MdOutlineModeEditOutline } from "react-icons/md";
import EditProfile from '../components/EditProfile.jsx';


function Home() {
  let {userData, setUserData, editUser, setEditUser} = useContext(userDataContext)


  return <div className='h-screen bg-gray-200'>
    <Navbar />
    {editUser && <EditProfile />}
    <div className='flex flex-col lg:flex-row  gap-[10px] px-[10px] pt-[70px] w-full'>
      <div className='w-full lg:w-[25%] bg-white rounded p-[10px] relative'>
        <div className='bg-gray-400 h-[110px] rounded cursor-pointer' >
          {userData.coverImage && <img src={userData.coverImage} alt="cover image" />}
          <IoIosCamera className='h-[25px] w-[25px] absolute top-3 right-4 text-white' />
        </div>
        <div className='rounded-full bg-blue-200 h-[50px] w-[50px]  flex justify-center items-center cursor-pointer  absolute top-[90px] left-6'>
            <img src={profileImg} alt='profile image' className='rounded-full'/>
        </div>
        <div className='rounded-full bg-blue-400 w-[20px] h-[20px] flex justify-center items-center absolute top-[118px] left-16 cursor-pointer'>
          <FaPlus className='text-white' />
        </div>
        <div className='py-[20px] px-[15px]'>
          <div className='font-semibold'>
            {userData.username}
          </div>
          <div className='text-gray-600'>
            {userData.location}
          </div>
        </div>
        <div className='w-full border-2 border-blue-400 text-blue-400 text-center p-[5px] rounded-full cursor-pointer flex justify-center gap-[5px] items-center' onClick={()=> setEditUser(!editUser)}>
          <button className='cursor-pointer'>Edit Profile</button>
          <MdOutlineModeEditOutline className='cursor-pointer' />
        </div>
      </div>


      <div className='w-full lg:w-[50%] bg-white rounded'>regr</div>
      <div className='w-full lg:w-[25%] bg-white rounded'>eegt</div>
    </div>
  </div>
}

export default Home