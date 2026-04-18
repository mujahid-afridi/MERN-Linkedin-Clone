import React from 'react'
import Navbar from '../components/Navbar.jsx'
import { useContext } from 'react'
import { userDataContext } from '../context/CurrentUserContext.jsx'
import profileImg from "../assets/profileImg.webp"
import { IoIosCamera } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { MdOutlineModeEditOutline } from "react-icons/md";
import EditProfile from '../components/EditProfile.jsx';
import CreatePostPopup from '../components/CreatePostPopup.jsx';
import axios from 'axios'
import { authDataContext } from '../context/AuthContext.jsx'
import { useState } from 'react'
import { useEffect } from 'react'
import ConnectionBtn, { socket } from '../components/ConnectionBtn.jsx'
import Posts from '../components/Posts.jsx'

function Profile() {
    let {serverURL} = useContext(authDataContext)
    let {userData, setUserData, editUser, setEditUser, posts, setPosts, profileData, setProfileData} = useContext(userDataContext)
    let [connections, setConnections] = useState([])
    let [userPosts, setUserPosts] = useState([])

    let handleConnections = async()=>{
        try{
            let result;
            if(Object.keys(profileData || {}).length > 0){
                result = await axios.get(serverURL+`/api/connection/${profileData._id}`, {withCredentials:true})
            }else{
                result = await axios.get(serverURL+`/api/connection/${userData._id}`, {withCredentials:true})
            }
            setConnections(result.data)
        }
        catch(error){
            console.log(error)
        }
    }

    let handlePosts = ()=>{
        if(Object.keys(profileData || {}).length > 0){
            setUserPosts(posts.filter(post=> post.author?._id == profileData._id))
        }else{
            setUserPosts(posts.filter(post=> post.author?._id == userData._id))
        }
    }

    useEffect(()=>{
        handleConnections()
        handlePosts()
        socket.on("connectionUpdate", ({connections})=>{
            setConnections(connections)
        })

        return () =>{
            socket.off("connectionUpdate")
        }
    }, [userData])


  return <div className='min-h-screen bg-gray-200 overflow-auto'  >
    <Navbar />
    {editUser && <EditProfile />}
    {Object.keys(profileData || {}).length > 0 && <div className='w-full flex flex-col gap-[20px] items-center pt-[70px] pb-[20px] px-[10px]'>
        <div className='w-full lg:max-w-[900px] bg-white rounded-lg p-[10px] relative shadow-lg'>
            <div className='bg-gray-400 h-[110px] rounded cursor-pointer' >
              {profileData?.coverImage && <img src={profileData.coverImage} alt="cover image"  className='w-[100%] h-[100%]'/>}
              <IoIosCamera className='h-[25px] w-[25px] absolute top-3 right-4 text-white' />
            </div>
            <div className='rounded-full bg-blue-200 h-[50px] w-[50px]  flex justify-center items-center cursor-pointer  absolute top-[90px] left-6'>
                <img src={ profileData?.profileImage || profileImg} alt='profile image' className='rounded-full w-[100%] h-[100%]'/>
            </div>
            <div className='rounded-full bg-blue-400 w-[20px] h-[20px] flex justify-center items-center absolute top-[118px] left-16 cursor-pointer'>
              <FaPlus className='text-white' />
            </div>
            <div className='py-[20px] px-[15px]'>
              <div className='font-semibold'>
                {profileData.username}
              </div>
              <div className='text-gray-500'>
                {profileData.headline}
              </div>
              <div className='text-gray-500 text-[15px]'>
                {profileData.location}
              </div>
              <div className='text-[15px] mt-[10px] text-gray-500'>
                {connections.length} connections
              </div>
              <ConnectionBtn  userId={profileData._id} customeStyle={"mt-[20px] w-full"}/>
            </div>
        </div>
        <div className='h-[100px] text-gray-500 bg-white shadow-lg w-full lg:max-w-[900px] flex items-center p-[10px] rounded-lg font-semibold'>
            Posts ({userPosts.length})
        </div>
        <div className='w-full lg:max-w-[900px] flex flex-col gap-[20px]'>
            {userPosts && userPosts.map((post, i)=>{
                return <Posts index={i} post={post} />
            })}
        </div>
        {<div className='w-full lg:max-w-[900px] bg-white p-[10px] rounded-lg'>
            <div className='font-semibold text-gray-500'>Skills</div>
            <div className='flex gap-[15px] mt-[20px] items-center flex-wrap'>
                {profileData.skills.map((skill)=> <div>{skill}</div>)}
            </div>
        </div>}
        <div className='w-full lg:max-w-[900px] bg-white p-[10px] rounded-lg'>
            <div className='font-semibold text-gray-500 mb-[20px]'>Education</div>
            <div className='pl-[10px] flex flex-col gap-[10px] text-gray-500 '>
                {profileData.education.map((edu, index)=> <div key={index} className='border-b-1 pb-[10px] border-gray-400'>
                    <div>college : {edu.college}</div>
                    <div>degree : {edu.degree}</div>
                    <div>field of Study : {edu.fieldOfStudy}</div>
                </div>)}
            </div>
        </div>
        <div className='w-full lg:max-w-[900px] bg-white p-[10px] rounded-lg'>
            <div className='font-semibold text-gray-500 mb-[20px]'> Experience</div>
            <div className='pl-[10px] flex flex-col gap-[10px] text-gray-500'>
                {profileData.experience.map((exp)=> <div className='border-b-1 pb-[10px] border-gray-400'>
                    <div>title : {exp.title}</div>
                    <div>company : {exp.company}</div>
                    <div>description : {exp.description}</div>
                </div>)}
            </div>
        </div>
    </div>}



    {Object.keys(profileData || {}).length === 0  && <div className='w-full flex flex-col gap-[20px] items-center pt-[70px] pb-[20px] px-[10px]'>
        <div className='w-full lg:max-w-[900px] bg-white rounded-lg p-[10px] relative shadow-lg'>
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
              <div className='text-[15px] mt-[10px]'>
                {connections.length} connections
              </div>
            </div>
            <div className='w-full border-2 border-blue-400 text-blue-400 text-center p-[5px] rounded-full cursor-pointer flex justify-center gap-[5px] items-center' onClick={()=> setEditUser(!editUser)}>
              <button className='cursor-pointer'>Edit Profile</button>
              <MdOutlineModeEditOutline className='cursor-pointer' />
            </div>
        </div>
        <div className='h-[100px] text-gray-700 bg-white shadow-lg w-full lg:max-w-[900px] flex items-center p-[10px] rounded-lg font-semibold'>
            Posts ({userPosts.length})
        </div>
        <div className='w-full lg:max-w-[900px] flex flex-col gap-[20px]'>
            {userPosts && userPosts.map((post, i)=>{
                return <Posts key={i} index={i} post={post} />
            })}
        </div>
        {<div className='w-full lg:max-w-[900px] bg-white p-[10px] rounded-lg'>
            <div className='font-semibold text-gray-700'>Skills</div>
            <div className='flex gap-[15px] mt-[20px] items-center flex-wrap'>
                {userData.skills.map((skill)=> <div>{skill}</div>)}
                <button className='rounded-full border-2 text-blue-400 border-blue-400 px-[25px] py-[5px] cursor-pointer' onClick={()=> setEditUser(!editUser)}>Add Skills</button>
            </div>
        </div>}
        <div className='w-full lg:max-w-[900px] bg-white p-[10px] rounded-lg'>
            <div className='font-semibold text-gray-700 mb-[20px]'>Education</div>
            <div className='pl-[10px] flex flex-col gap-[10px]'>
                {userData.education.map((edu)=> <div className='border-b-1 pb-[10px] border-gray-400'>
                    <div>college : {edu.college}</div>
                    <div>degree : {edu.degree}</div>
                    <div>field of Study : {edu.fieldOfStudy}</div>
                </div>)}
                <button className='w-full max-w-[200px] rounded-full border-2 text-blue-400 border-blue-400 px-[25px] py-[5px] cursor-pointer' onClick={()=> setEditUser(!editUser)}>Add Education</button>
            </div>
        </div>
        <div className='w-full lg:max-w-[900px] bg-white p-[10px] rounded-lg'>
            <div className='font-semibold text-gray-700 mb-[20px]'> Experience</div>
            <div className='pl-[10px] flex flex-col gap-[10px]'>
                {userData.experience.map((exp)=> <div className='border-b-1 pb-[10px] border-gray-400'>
                    <div>title : {exp.title}</div>
                    <div>company : {exp.company}</div>
                    <div>description : {exp.description}</div>
                </div>)}
                <button className='w-full max-w-[200px] rounded-full border-2 text-blue-400 border-blue-400 px-[25px] py-[5px] cursor-pointer' onClick={()=> setEditUser(!editUser)}>Add Experience</button>
            </div>
        </div>
    </div>}
  </div>
}

export default Profile