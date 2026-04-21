import React from 'react'
import axios from "axios"
import { useContext } from 'react'
import { useEffect } from 'react'
import { userDataContext } from '../context/CurrentUserContext.jsx'
import { authDataContext } from '../context/AuthContext.jsx'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { socket } from '../context/CurrentUserContext.jsx'
export default function ConnectionBtn({userId, customeStyle}) {

  const {serverURL} = useContext(authDataContext)
  const {userData, setUserData} = useContext(userDataContext)
  let [status, setStatus] = useState("connect")
  let navigate = useNavigate()

  const handleSendConnection = async()=>{
    try{
      let result = await axios.post(serverURL+`/api/connection/send/${userId}`,{}, {withCredentials : true})
    }
    catch(error){
      console.log(error)
    }
  }
  const handleRemoveConnection = async()=>{
    try{
      let result = await axios.delete(serverURL+`/api/connection/remove/${userId}`, {withCredentials : true})
    }
    catch(error){
      console.log(error)
    }
  }

  const handelGetStatus = async()=>{
    try{
      let result = await axios.get(serverURL+`/api/connection/getstatus/${userId}`, {withCredentials:true})
      setStatus(result.data?.status)
    }
    catch(error){
      console.log(error)
    }
  }

  const handleClick = async()=>{
    try{
      if(status == "disconnect"){
        await handleRemoveConnection()
      }else if(status == "received"){
        navigate('/network')
      }else{
        await handleSendConnection()
      }
    }
    catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
    socket.emit("register", userData._id)
    handelGetStatus()
    socket.on("statusUpdate", ({updatedUserId, newStatus})=>{
      if(updatedUserId == userId){
        setStatus(newStatus)
      }
    })

    return ()=>{
      socket.off("statusUpdate")
    }
  }, [userId])


  return (
    <div>
        <button disabled={status === "pending"} className={`border-2  border-blue-400 text-blue-400 text-center rounded-full cursor-pointer ${status == "pending" ? "border-blue-200 text-blue-200 " : ""}  ${customeStyle}`} onClick={handleClick}>{status}</button>
    </div>
  )
}
