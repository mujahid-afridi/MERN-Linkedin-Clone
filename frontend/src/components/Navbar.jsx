import React from 'react'
import logo2 from "../assets/logo2.png"
import { IoSearchSharp } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";
import { IoMdPeople } from "react-icons/io";
import { IoNotifications } from "react-icons/io5";
import profileImg from "../assets/profileImg.webp"
import { useState } from 'react';
import ProfilePopup from './ProfilePopup.jsx';

function Navbar() {
  const [activeSearch, setActiveSearch] = useState(false)
  const [showProfilePopup, setShowProfilePopup] = useState(false)




  return (
   <div className='w-full bg-white fixed top-0 left-0 z-10 h-13 shadow-lg flex justify-center items-center px-[5px]'>
     <div className='w-full md:max-w-[1600px] flex justify-between sm:justify-around items-center'>
        <div className='flex justify-between gap-[5px] items-center'>
          <div className='w-10 h-10 cursor-pointer'>
            <img src={logo2}/>
          </div>

          {activeSearch==false && <IoSearchSharp className='lg:hidden h-[25px] w-[25px] cursor-pointer' onClick={()=> setActiveSearch(!activeSearch)} />}

          <form action="">
            <div className={`${activeSearch ? "flex":"hidden"} md:w-[400px] lg:flex items-center gap-[10px] border-2 border-gray-200 rounded-3xl px-[8px] py-[6px]`}>
                <IoSearchSharp className='h-[25px] w-[25px] cursor-pointer' onClick={()=> setActiveSearch(!activeSearch)}/>
                <input type="text" placeholder='search...' className='outline-none w-full'/>
            </div>
          </form>
        </div>
        <div className='flex gap-[15px] items-center relative'>
          <div className='hidden lg:flex flex-col items-center cursor-pointer'>
            <div><AiFillHome className='h-[20px] w-[20px]'/></div>
            <div className='text-sm text-gray-800'>Home</div>
          </div>
          <div className='hidden lg:flex flex-col items-center cursor-pointer'>
            <div><IoMdPeople className='h-[20px] w-[20px]'/></div>
            <div className='text-sm text-gray-800'>My Network</div>
          </div>
          <div className='flex flex-col items-center cursor-pointer'>
            <div><IoNotifications className='h-[20px] w-[20px]'/></div>
            <div className='hidden sm:flex text-sm text-gray-800'>Notification</div>
          </div>
          <div className='rounded-full bg-blue-300 flex justify-center items-center cursor-pointer' onClick={()=> setShowProfilePopup(!showProfilePopup)}>
            <img src={profileImg} alt='profile image' className='h-[40px] w-[40px] rounded-full'/>
          </div>
          {showProfilePopup && <ProfilePopup />}
        </div>
    </div>
   </div>
  )
}

export default Navbar