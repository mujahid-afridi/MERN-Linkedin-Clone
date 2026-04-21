import React from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { createContext } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import io from 'socket.io-client'

export let userDataContext = createContext()
export const socket = io("http://localhost:9000")


function UserContext({children}) {
    let [userData, setUserData] = useState(null)
    let {serverURL} = useContext(authDataContext)
    let [editUser, setEditUser] = useState(false)
    let [postPopup, setPostPopup] = useState(false)
    let [loading, setLoading] = useState(false)
    let [posts, setPosts] = useState([])
    let [profileData, setProfileData] = useState({})
    let navigate = useNavigate("")
    let [skipPost, setSkipPost] = useState(0)
    const limit = 5
    let [hasMore, setHasMore] = useState(true)

    const getCurrentUser = async ()=>{
        try{
            let result = await axios.get(serverURL+"/api/user/currentuser", {withCredentials : true})
            setUserData(result.data)
            console.log("userdata = ", result.data)
        }
        catch(error){
            console.log("getCurrentUser error" , error)
            setUserData(null)
        }
    }

    const getAllPosts = async(newSkipPostValue = skipPost)=>{
        try{
            let result = await axios.get(serverURL+`/api/post/getallposts/?skip=${newSkipPostValue}&limit=${limit}`,{withCredentials:true})
            
            if(result.data.length === 0){
                setHasMore(false)
                return 
            }

            if(newSkipPostValue === 0 ){
                setPosts(result.data)
            }else{
                setPosts((prevposts)=> [...prevposts, ...result.data])
            }
            console.log("all posts = ",posts)
        }
        catch(error){
            setPosts([])
            console.log(error)
        }
    }

    let handleGetUserProfile = async(id)=>{
        try{
            let result = await axios.get(serverURL+`/api/user/profile/${id}`, {withCredentials:true})
            setProfileData(result.data)
            navigate("/profile")
        }
        catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
        getCurrentUser(),
        getAllPosts()
    }, [])


    let value = {
        userData, setUserData, editUser, setEditUser, postPopup, setPostPopup, loading, setLoading, posts,setPosts,
        getAllPosts, handleGetUserProfile, profileData, setProfileData, skipPost, setSkipPost, limit, hasMore

    }
  return (
    <userDataContext.Provider value={value}>
        {children}
    </userDataContext.Provider>
  )
}

export default UserContext