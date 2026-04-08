import React, { useContext, useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import { userDataContext } from "../context/CurrentUserContext.jsx"
import { IoIosCamera } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import profileImg from "../assets/profileImg.webp"

function EditProfile() {
    let {userData, setUserData, editUser, setEditUser} = useContext(userDataContext)

    let [firstname, setFirstName] = useState(userData.firstname || "")
    let [lastname, setLastName] = useState(userData.lastname || "")
    let [location, setLocation] = useState(userData.location || "")
    let [username, setUsername] = useState(userData.username || "")
    let [headline, setHeadline] = useState(userData.headline || "")
    let [gender, setGender] = useState(userData.gender || "")
    let [skills, setSkills] = useState(userData.skills || [])
    let [newSkill, setNewSkill] = useState("")

    console.log("skills = ", skills)

    let add = (e)=>{
        e.preventDefault()
        if(newSkill && !skills.some(skill => skill.toLowerCase() === newSkill.toLowerCase())){
            setSkills(skills=> [...skills, newSkill])
            setNewSkill("")
        }
    }

    let remove = (skill) =>{
        let x = skills.filter(s=> s!=skill)
        setSkills(x)
    }


  return <div className='h-screen w-full fixed top-0 z-100 flex justify-center items-center'>
    <div className='bg-black w-full h-full fixed top-0  opacity-[0.5]'></div>
    <div className='bg-white w-[90%] max-w-[400px] h-[600px] z-200 relative rounded-lg shadow-lg p-[10px] overflow-auto'>
        <div className='absolute top-2 right-2 flex justify-end items-center'>
            <RxCross2 className='font-bold h-[20px] w-[20px] cursor-pointer' onClick={()=> setEditUser(!editUser)} />
        </div>
        <div className='relative top-[20px]' >
            <div className='bg-gray-400 h-[110px] rounded cursor-pointer' >
                {userData.coverImage && <img src={userData.coverImage} alt="cover image" />}
                <IoIosCamera className='h-[25px] w-[25px] absolute top-3 right-4 text-white' />
            </div>
            <div className='rounded-full bg-blue-200 h-[50px] w-[50px]  flex justify-center items-center cursor-pointer  absolute top-[80px] left-4'>
                <img src={profileImg} alt='profile image' className='rounded-full'/>
            </div>
            <div className='rounded-full bg-blue-400 w-[20px] h-[20px] flex justify-center items-center absolute top-[110px] left-13 cursor-pointer'>
                <FaPlus className='text-white' />
            </div>
        </div>
        <div className='w-full  mt-[55px]'>
            <form className='w-full flex flex-col gap-[8px]' >
                <input type="text" placeholder='firstname' value={firstname} onChange={(e)=> setFirstName(e.target.value)} className='border-1 rounded-md p-[5px]' />
                <input type="text" placeholder='lastname' value={lastname} onChange={(e)=> setLastName(e.target.value)} className='border-1 rounded-md p-[5px]' />
                <input type="text" placeholder='username' value={username} onChange={(e)=> setUsername(e.target.value)} className='border-1 rounded-md p-[5px]' />
                <input type="text" placeholder='headline' value={headline} onChange={(e)=> setHeadline(e.target.value)} className='border-1 rounded-md p-[5px]' />
                <input type="text" placeholder='location' value={location} onChange={(e)=> setLocation(e.target.value)} className='border-1 rounded-md p-[5px]' />
                <input type="text" placeholder='gender (male / female / other)' value={gender} onChange={(e)=> setGender(e.target.value)} className='border-1 rounded-md p-[5px]' />
                <form className='flex flex-col items-start gap-[5px] border-1 rounded-lg p-[5px]'>
                    <div className='font-semibold'>Skills</div>
                    {skills &&  skills.map((skill, i)=>{
                        return <div key={i} className='border-dashed border-1  p-[5px] w-full rounded-lg  flex justify-between items-center '>
                            {skill}
                            <RxCross2 className='font-bold h-[15px] w-[15px] cursor-pointer flex-shrink-0' onClick={()=>  remove(skill)} />
                        </div>
                    })}
                    <input type="text" value={newSkill} placeholder='new skill' onChange={(e)=> setNewSkill(e.target.value)} className='border-1 p-[5px] w-full rounded-lg outline-none mt-[10px]' />
                    <button className='w-full text-center border-1 border-blue-400 rounded-lg cursor-pointer' onClick={add}>Add</button>
                </form>
            </form>
        </div>
    </div>
  </div>
}

export default EditProfile