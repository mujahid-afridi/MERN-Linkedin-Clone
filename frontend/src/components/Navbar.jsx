import React, { useContext, useRef } from 'react'
import logo2 from "../assets/logo2.png"
import { IoSearchSharp } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";
import { IoMdPeople } from "react-icons/io";
import { IoNotifications } from "react-icons/io5";
import profileImg from "../assets/profileImg.webp"
import { useState } from 'react';
import ProfilePopup from './ProfilePopup.jsx';
import { userDataContext } from '../context/CurrentUserContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { authDataContext } from '../context/AuthContext.jsx';

function Navbar() {
  const {serverURL} = useContext(authDataContext)
  let {userData, editUserData, handleGetUserProfile, profileData, setProfileData} = useContext(userDataContext)

  const [activeSearch, setActiveSearch] = useState(false)
  const [showProfilePopup, setShowProfilePopup] = useState(false)
  let [searchInput, setSearchInput] = useState("")
  let [searchData, setSearchData] = useState([])


  let navigate = useNavigate("")

  const popupRef = useRef(null)

  const handleSearch = async()=>{
    try{
      let result = await axios.get(serverURL+`/api/user/search?query=${searchInput}`, {withCredentials:true})
      setSearchData(result.data)
      console.log("users = ", result.data)
    }
    catch(error){
      console.log(error)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowProfilePopup(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])


  useEffect(()=>{
    handleSearch()
  }, [searchInput])
  


  return (
   <div className='w-full bg-white fixed top-0 left-0 z-10 h-13 shadow-lg flex justify-center items-center px-[5px]'>
     <div className='w-full max-w-[2000px] flex  justify-between sm:justify-around items-center relative'>
        
        <div className='flex justify-between gap-[5px]  items-center md:relative '>
          <div className='w-10 h-10 cursor-pointer' onClick={()=> navigate("/")}>
            <img src={logo2}/>
          </div>
          {activeSearch==false && <IoSearchSharp className='lg:hidden h-[25px] w-[25px] cursor-pointer' onClick={()=> setActiveSearch(!activeSearch)} />}
          
          {searchInput.length > 0 && <div className='bg-white shadow-lg p-[10px] rounded-lg  absolute left-[0px] top-[60px] max-h-[300px] md:max-h-[400px] w-full lg:w-[800px] flex flex-col gap-[10px] overflow-auto'>
          {searchData && searchData.map((user, index)=>{
            return <div key={index} className='flex gap-2 items-start p-[10px] rounded hover:bg-gray-200 cursor-pointer' onClick={()=>{
              handleGetUserProfile(user._id) 
              setSearchInput("")
            } }>
              <div className='rounded-full  flex justify-center items-center '>
                  <img src={user.profileImage ? user.profileImage : profileImg} alt='profile image' className='h-[50px] w-[50px] rounded-full'/>
              </div>
              <div >
                  <div className='font-bold'>{user.username}</div>
                  <div className='text-gray-600 text-[14px]'>{user.headline}</div>
              </div>
            </div>
          })}
          </div>}

          <form>
            <div className={`${activeSearch ? "flex":"hidden"} md:w-[400px] lg:flex items-center gap-[10px] border-2 border-gray-200 rounded-3xl px-[8px] py-[6px]`}>
                <IoSearchSharp className='h-[25px] w-[25px] cursor-pointer' onClick={()=> setActiveSearch(!activeSearch)}/>
                <input type="text" placeholder='search...' className='outline-none w-full' value={searchInput} onChange={(e)=> setSearchInput(e.target.value)}/>
            </div>
          </form>
        </div>



        <div className='flex gap-[15px] items-center relative'>
          <div className='hidden lg:flex flex-col items-center cursor-pointer' onClick={()=>  navigate("/")}>
            <div><AiFillHome className='h-[20px] w-[20px]'/></div>
            <div className='text-sm text-gray-800'>Home</div>
          </div>
          <div className='hidden lg:flex flex-col items-center cursor-pointer' onClick={()=> navigate("/network")}>
            <div><IoMdPeople className='h-[20px] w-[20px]'/></div>
            <div className='text-sm text-gray-800'>My Network</div>
          </div>
          <div className='flex flex-col items-center cursor-pointer' onClick={()=> navigate("/notification")}>
            <div><IoNotifications className='h-[20px] w-[20px]'/></div>
            <div className='hidden sm:flex text-sm text-gray-800'>Notification</div>
          </div>
          <div ref={popupRef}>
            <div className='rounded-full bg-blue-300 flex justify-center items-center cursor-pointer' onClick={()=> setShowProfilePopup(!showProfilePopup)}>
              <img src={userData.profileImage ||  profileImg} alt='profile image' className='h-[40px] w-[40px] rounded-full'/>
            </div>
            {showProfilePopup && <ProfilePopup />}
          </div>
        </div>
    </div>
   </div>
  )
}

export default Navbar