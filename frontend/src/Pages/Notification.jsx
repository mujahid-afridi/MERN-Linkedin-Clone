import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { authDataContext } from '../context/AuthContext.jsx'
import axios from 'axios'
import { userDataContext } from '../context/CurrentUserContext.jsx'
import { RxCross1 } from "react-icons/rx";

function Notification() {
    const {serverURL} = useContext(authDataContext)
    let {userData, setUserData} = useContext(userDataContext)
    let [notifications, setNotifications] = useState([])

    let handleGetNotifications = async()=>{
        try{
            let result = await axios.get(serverURL+`/api/notification/getnotifications`, {withCredentials:true})
            console.log("getNotification result = ",result)
            setNotifications(result.data)
        }
        catch(error){
            console.log(error)
        }
    }


    let handleType = (notification)=>{
        if(notification.type === "like"){
            return "liked your post"
        }else if(notification.type === "comment"){
            return "commented on your post"
        }else if(notification.type === "connectionAccepted"){
            return "accepted your connection"
        }else{
            return ""
        }
    }


    let handleDeleteOneNotification = async(receiverId)=>{
        try{
            let result = await axios.delete(serverURL+`/api/notification/deleteone/${receiverId}`, {withCredentials:true})
            console.log(result.data?.message)
            await handleGetNotifications()
        }
        catch(error){
            console.log(error)
        }
    }


    let handleClearAllNotification = async()=>{
        try{
            let result = await axios.delete(serverURL+`/api/notification/`, {withCredentials:true})
            console.log(result.data?.message)
            setNotifications([])
        }
        catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
        handleGetNotifications()
    }, [userData])


  return <div className='h-screen bg-gray-200 flex justify-center overflow-auto' >
    <Navbar/>
    <div className='w-full  mt-[50px] p-[20px]'>
        <div className='w-full p-[10px] h-[100px] bg-white rounded-md flex items-center font-semibold text-gray-700'>
            Notification {notifications.length}
        </div>
        {notifications.length > 0 && <div className='flex flex-col flex-wrap items-center mt-[20px] gap-[10px]'>
           { notifications.map((notification, index)=> {
                return <div key={index} className='w-full md:max-w-[60%] p-[10px] bg-white rounded-md flex flex-col justify-between '>
                    <div className='flex gap-[10px] md:gap-[20px]'>
                        <div className='rounded-full bg-blue-300 flex justify-center items-center cursor-pointer h-[50px] w-[50px] rounded-full'>
                            <img src={notification.relatedUser?.profileImage ||  profileImg} alt='profile image' className='h-full w-full rounded-full'/>
                        </div>
                        <div className='flex flex-col gap-[10px] w-full pt-[10px]'>
                            <div className='font-semibold'>{notification.relatedUser?.username}   <span className='text-gray-600'>{handleType(notification)}</span></div>
                            {notification.type !== "connectionAccepted" && <div className='flex gap-[10px]  items-center'>
                                {notification.relatedPost?.image ?  (<img src={notification.relatedPost?.image} className='h-[60px] w-[100px] rounded-lg' alt="" />) : notification.relatedPost?.video ? (
                                    <video
                                        src={notification.relatedPost.video}
                                        className='h-[60px] w-[100px] rounded-lg object-cover'
                                    />) : null}
                                <div className="line-clamp-1">{notification.relatedPost?.description}</div>
                            </div>}
                        </div>
                        <div className='flex items-center'>
                            <RxCross1 className='border-2 rounded-full text-red-400 text-2xl p-1 cursor-pointer' onClick={()=> handleDeleteOneNotification(notification._id)} />
                        </div>
                    </div>
                    
                </div>
            })}
        </div>}
    </div>
  </div>
}

export default Notification