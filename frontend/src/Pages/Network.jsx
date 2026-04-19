import React from 'react'
import Navbar from '../components/Navbar.jsx'
import axios from 'axios'
import { useContext } from 'react'
import { authDataContext } from '../context/AuthContext.jsx'
import { useState } from 'react'
import { useEffect } from 'react'
import profileImg from "../assets/profileImg.webp"
import { RxCross1 } from "react-icons/rx";
import { TiTickOutline } from "react-icons/ti";
import { userDataContext } from '../context/CurrentUserContext.jsx'


function Network() {
    const {serverURL} = useContext(authDataContext)
    let {handleGetUserProfile} = useContext(userDataContext)
    let [invitations, setInvatations] = useState(0)
    let [requests, setRequests] = useState([])


    let handleRequests = async ()=>{
        try{
            let result = await axios.get(serverURL+`/api/connection/requests`, {withCredentials:true})
            setInvatations(result.data?.length)
            setRequests(result.data)
        }
        catch(error){
            console.log(error)
        }
    }

    let handleAcceptRequest = async(connectionId, receiverId)=>{
        try{
            let result = await axios.put(serverURL+`/api/connection/accept/${connectionId}`, {}, {withCredentials:true})
            let response = await axios.post(serverURL+`/api/notification/create/${"connectionAccepted"}`, {receiverId}, {withCredentials:true})
            console.log("notification create response = ", response)


            console.log("handleAcceptRequest = ", result)
            setRequests(pre=> pre.filter(req=> req._id !== connectionId))
            setInvatations(pre=> Number(pre) - 1)
        }
        catch(error){
            console.log(error)
        }
    }
    let handleRejectRequest = async(connectionId)=>{
        try{
            let result = await axios.put(serverURL+`/api/connection/reject/${connectionId}`, {}, {withCredentials:true})
            console.log("handleRejectRequest = ", result)
            setRequests(pre=> pre.filter(req=> req._id !== connectionId))
            setInvatations(pre=> pre-1)
        }
        catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
        handleRequests()
    }, [])



  return <div className='h-screen bg-gray-200 flex justify-center overflow-auto' >
    <Navbar/>
    <div className='w-full  mt-[50px] p-[20px]'>
        <div className='w-full p-[10px] h-[100px] bg-white rounded-md flex items-center font-semibold text-gray-700'>
            Invitations {invitations}
        </div>
        {invitations > 0 && <div className='flex flex-col flex-wrap items-center mt-[20px] gap-[10px]'>
           { requests.map((request)=> {
                return <div className='w-full md:max-w-[60%] p-[10px] h-[100px] bg-white rounded-md flex justify-between items-center'>
                    <div className='flex gap-[10px] md:gap-[20px] items-center'>
                        <div className='rounded-full bg-blue-300 flex justify-center items-center cursor-pointer' onClick={()=> handleGetUserProfile(request.sender._id)}>
                            <img src={request.sender.profileImage ||  profileImg} alt='profile image' className='h-[50px] w-[50px] rounded-full'/>
                        </div>
                        <div className='font-semibold'>{request.sender.username}</div>
                    </div>
                    <div className='flex gap-[20px] items-center'>
                        <TiTickOutline className='border-2 rounded-full text-green-400 text-2xl cursor-pointer' onClick={()=> handleAcceptRequest(request._id, request.sender._id)} />
                        <RxCross1 className='border-2 rounded-full text-red-400 text-2xl p-1 cursor-pointer' onClick={()=> handleRejectRequest(request._id)}  />
                    </div>
                </div>
            })}
        </div>}
    </div>
  </div>
}

export default Network