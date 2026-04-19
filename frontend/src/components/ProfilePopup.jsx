import React, { useContext } from 'react'
import { IoMdPeople } from "react-icons/io";
import profileImg from "../assets/profileImg.webp"
import { userDataContext } from "../context/CurrentUserContext.jsx"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authDataContext } from '../context/AuthContext.jsx';
import { useState } from 'react';


function ProfilePopup() {
    let {serverURL} = useContext(authDataContext)
    let {userData, setUserData, profileData, setProfileData} = useContext(userDataContext)
    let navigate = useNavigate()

    let handleSignOut = async ()=>{
        try{
            let result = await axios.get(serverURL+"/api/auth/logout", {withCredentials:true})
            console.log(result.data.message)
            setUserData(null)
            navigate("/login")
            console.log("navigate to login screeen")
        }
        catch(error){
            console.log(error)
        }
    }

  return <div className='p-[10px] flex flex-col justify-center gap-[10px] w-[200px] min-h-[250px] bg-white absolute top-[50px] right-0  rounded-lg shadow-lg'>
    <div className='flex flex-col justify-center gap-[10px]'>
        <div className='rounded-full  flex justify-center items-center cursor-pointer'>
            <img src={userData.profileImage? userData.profileImage : profileImg} alt='profile image' className='h-[40px] w-[40px] rounded-full'/>
        </div>
        <div className='font-bold text-center'>{userData?.username}</div>
        <button className='w-full border-2 border-blue-400 text-blue-400 text-center p-[5px] rounded-full cursor-pointer' onClick={()=> {
            setProfileData(null)
            navigate("/profile")
        }}>View Profile</button>
    </div>
    <div className='w-full bg-gray-400 h-[2px]'></div>
    <div className='flex flex-col justify-center gap-[10px] '>
        <div className='flex gap-[10px] cursor-pointer'>
            <div><IoMdPeople className='h-[20px] w-[20px] '/></div>
            <div className='text-sm text-gray-800'>My Network</div>
        </div>
        <button className='w-full border-2 border-blue-400 text-blue-400 text-center p-[5px] rounded-full cursor-pointer' onClick={handleSignOut}>Sign Out</button>
    </div>
  </div>
}

export default ProfilePopup