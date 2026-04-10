import React from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { createContext } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'
import { useEffect } from 'react'

export let userDataContext = createContext()


function UserContext({children}) {
    let [userData, setUserData] = useState(null)
    let {serverURL} = useContext(authDataContext)
    let [editUser, setEditUser] = useState(false)
    let [postPopup, setPostPopup] = useState(false)

    const getCurrentUser = async ()=>{
        try{
            let result = await axios.get(serverURL+"/api/user/currentuser", {withCredentials : true})
            setUserData(result.data)
        }
        catch(error){
            console.log("getCurrentUser error" , error)
            setUserData(null)
        }
    }

    useEffect(()=>{
        getCurrentUser()
    }, [])


    let value = {
        userData, setUserData, editUser, setEditUser, postPopup, setPostPopup
    }
  return (
    <userDataContext.Provider value={value}>
        {children}
    </userDataContext.Provider>
  )
}

export default UserContext