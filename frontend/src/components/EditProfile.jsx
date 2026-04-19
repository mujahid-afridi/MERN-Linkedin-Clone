import React, { useContext, useRef, useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import { userDataContext } from "../context/CurrentUserContext.jsx"
import { IoIosCamera } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import profileImg from "../assets/profileImg.webp"
import axios from 'axios';
import { authDataContext } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

function EditProfile() {
    let {userData, setUserData, editUser, setEditUser, loading, setLoading} = useContext(userDataContext)
    let {serverURL} = useContext(authDataContext)
    let navigate = useNavigate()
    let profileImageRef = useRef(userData.profileImage || profileImg)
    let coverImageRef = useRef(userData.coverImage || null)
    let [frontendProfileImage, setFrontendProfileImage] = useState(userData.profileImage || null)
    let [backendProfileImage, setBackendProfileImage] = useState(null)
    let [frontendCoverImage, setFrontendCoverImage] = useState(userData.coverImage || null)
    let [backendCoverImage, setBackendCoverImage] = useState(null)

    let [firstname, setFirstName] = useState(userData.firstname || "")
    let [lastname, setLastName] = useState(userData.lastname || "")
    let [location, setLocation] = useState(userData.location || "")
    let [username, setUsername] = useState(userData.username || "")
    let [headline, setHeadline] = useState(userData.headline || "")
    let [gender, setGender] = useState(userData.gender || "")
    let [skills, setSkills] = useState(userData.skills || [])
    let [newSkill, setNewSkill] = useState("")

    //Education states
    let [education, setEducation] = useState(userData.education || [])
    let [newEducation, setNewEducation] = useState({
        college : "",
        degree : "",
        fieldOfStudy : ""
    })
    let [requiredFieldsError, setRequiredFieldsError] = useState(false) //when fields are emtpy and try to add
    let [duplicateEducationError, setDuplicateEducationError] = useState("") //when we are trying to add duplicate education

    // Experience states
    let [experience, setExperience] = useState(userData.experience || [])
    let [newExperience, setNewExperience] = useState({
        title : "",
        company : "",
        description : ""
    })
    let [requiredExperienceFieldsError, setRequiredExperienceFieldsError] = useState(false) //when fields are emtpy and try to add
    let [duplicateExperienceError, setDuplicateExperienceError] = useState("") // when we are trying to add duplicate experinece


    console.log("skills = ", skills)
    console.log("education = ",education)

    let add = ()=>{
        if(newSkill && !skills.some(skill => skill.toLowerCase() === newSkill.toLowerCase())){
            setSkills(skills=> [...skills, newSkill])
            setNewSkill("")
        }
    }
    let remove = (skill) =>{
        let x = skills.filter(s=> s!=skill)
        setSkills(x)
    }
    let addEducation = ()=>{
        if(education.some((edu)=> {
            return (edu.college.toLowerCase() === newEducation.college.toLowerCase() && 
                edu.degree.toLowerCase() === newEducation.degree.toLowerCase() && 
                edu.fieldOfStudy.toLowerCase() === newEducation.fieldOfStudy.toLowerCase()) }
        )){
            setDuplicateEducationError("*This education is already added")
            return 
        }

        if(newEducation.college.trim() && newEducation.degree.trim()  && newEducation.fieldOfStudy.trim()){
            setEducation([...education, newEducation])
            setNewEducation({
                college : "",
                degree : "",
                fieldOfStudy : ""
            })
            setRequiredFieldsError(false)
            setDuplicateEducationError("")
            console.log("New education added successfully")
        }else{
            setRequiredFieldsError(true)
            console.log("All fields are required and cannot contain only spaces.");
        }
    }
    let removeEducation = (educObject) =>{
        if(!educObject){
            return 
        }
        education = education.filter((ed)=> ed!=educObject)
        setEducation(education)
    }
    let addExperience = ()=>{
        if(experience.some(exp => {
            return (exp.title.toLowerCase()=== newExperience.title.toLowerCase() &&
            exp.company.toLowerCase()=== newExperience.company.toLowerCase() &&
            exp.description.toLowerCase()=== newExperience.description.toLowerCase())
        } )){
            console.log("This experience is already added")
            setDuplicateExperienceError("*This experience is already added")
            return 
        }
        
        if(newExperience?.title.trim() && newExperience?.company.trim()  && newExperience?.description.trim()){
            setExperience([...experience, newExperience])
            setNewExperience({
                title : "",
                company : "",
                description : ""
            })
            setDuplicateExperienceError("")
            setRequiredExperienceFieldsError(false)
            console.log("New experience added successfully")
        }else{
            setRequiredExperienceFieldsError(true)
            console.log("All fields are required and cannot contain only spaces.");
        }
    }
    let removeExperience = (expObject) =>{
        if(!expObject){
            return 
        }
        experience = experience.filter((exp)=> exp!=expObject)
        setExperience(experience)
    }
    let handleUpdateCurrentUser = async ()=>{
        try{
            setLoading(true)
            let formdata = new FormData()
            formdata.append("firstname", firstname)
            formdata.append("lastname", lastname)
            formdata.append("username", username)
            formdata.append("location", location)
            formdata.append("skills", JSON.stringify(skills)  )
            formdata.append("experience", JSON.stringify(experience))
            formdata.append("education", JSON.stringify(education))
            formdata.append("headline", headline)

            if(backendProfileImage){
                formdata.append("profileImage", backendProfileImage)
            }
            if(backendCoverImage){
                formdata.append("coverImage", backendCoverImage)
            }

            let result =  await axios.put(serverURL+"/api/user/updatecurrentuser", formdata, {withCredentials:true})
            setUserData(result.data)
            setLoading(false)
            setEditUser(false)
        }
        catch(error){
            setLoading(false)
            console.log("Error in handleUpdateCurrentUser = ", error)
        }
    }

    const handleProfileImage = (e) =>{
        let file = e.target.files[0]
        setBackendProfileImage(file)
        setFrontendProfileImage(URL.createObjectURL(file))
    }

    const handleCoverImage = (e) =>{
        let file = e.target.files[0]
        setBackendCoverImage(file)
        setFrontendCoverImage(URL.createObjectURL(file))
    }


  return <div className='h-screen w-full fixed top-0 z-100 flex justify-center items-center'>
    <div className='bg-black w-full h-full fixed top-0  opacity-[0.5]'></div>
    <div className='bg-white w-[90%] max-w-[400px] h-[600px] z-200 relative rounded-lg shadow-lg p-[10px] overflow-auto'>
        <div className='absolute top-2 right-2 flex justify-end items-center'>
            <RxCross2 className='font-bold h-[20px] w-[20px] cursor-pointer' onClick={()=> setEditUser(!editUser)} />
        </div>
        <div className='relative top-[20px]' >
            <input type="file" hidden accept='image/*' ref={profileImageRef} onChange={handleProfileImage} />
            <input type="file" accept='image/*' hidden ref={coverImageRef} onChange={handleCoverImage} />
            <div className='bg-gray-400 h-[110px] rounded cursor-pointer' onClick={()=> coverImageRef.current.click()} >
                {frontendCoverImage && <img src={frontendCoverImage} alt="cover image" className='w-[100%] h-[100%] rounded' />}
                <IoIosCamera className='h-[25px] w-[25px] absolute top-3 right-4 text-white' />
            </div>
            <div className='rounded-full bg-blue-200 h-[50px] w-[50px]  flex justify-center items-center cursor-pointer  absolute top-[80px] left-4' onClick={()=> profileImageRef.current.click()}>
                <img src={frontendProfileImage || profileImg} alt='profile image' className='rounded-full w-[100%] h-[100%]'/>
            </div>
            <div className='rounded-full bg-blue-400 w-[20px] h-[20px] flex justify-center items-center absolute top-[110px] left-13 cursor-pointer' onClick={()=> profileImageRef.current.click()}>
                <FaPlus className='text-white' />
            </div>
        </div>
        <div className='w-full  mt-[55px]'>
            <form className='w-full flex flex-col gap-[8px] '>
                <input type="text" placeholder='firstname' value={firstname} onChange={(e)=> setFirstName(e.target.value)} className='border-1 rounded-md p-[5px]' />
                <input type="text" placeholder='lastname' value={lastname} onChange={(e)=> setLastName(e.target.value)} className='border-1 rounded-md p-[5px]' />
                <input type="text" placeholder='username' value={username} onChange={(e)=> setUsername(e.target.value)} className='border-1 rounded-md p-[5px]' />
                <input type="text" placeholder='headline' value={headline} onChange={(e)=> setHeadline(e.target.value)} className='border-1 rounded-md p-[5px]' />
                <input type="text" placeholder='location' value={location} onChange={(e)=> setLocation(e.target.value)} className='border-1 rounded-md p-[5px]' />
                <input type="text" placeholder='gender (male / female / other)' value={gender} onChange={(e)=> setGender(e.target.value)} className='border-1 rounded-md p-[5px]' />
                <div className='flex flex-col items-start gap-[5px] border-1 rounded-lg p-[5px]'>
                    <div className='font-semibold'>Skills</div>
                    {skills &&  skills.map((skill, i)=>{
                        return <div key={i} className='border-dashed border-1  p-[5px] w-full rounded-lg  flex justify-between items-center '>
                            {skill}
                            <RxCross2 className='font-bold h-[15px] w-[15px] cursor-pointer flex-shrink-0' onClick={()=>  remove(skill)} />
                        </div>
                    })}
                    <input type="text" value={newSkill} placeholder='new skill' onChange={(e)=> setNewSkill(e.target.value)} className='border-1 p-[5px] w-full rounded-lg outline-none mt-[10px]' />
                    <button type='button' className='w-full text-center border-1 border-blue-400 rounded-lg cursor-pointer' onClick={add}>Add</button>
                </div>
                <div className='flex flex-col items-start gap-[10px] border-1 rounded-lg p-[5px]'>
                    <div className='font-semibold'>Education</div>
                    {education &&  education.map((educationObject, i)=>{
                        return <div key={i} className='border-dashed border-1  p-[5px] w-full rounded-lg  flex  justify-between items-center '>
                            <div className='w-full flex flex-col gap-[5px]'>
                                <div><span className='font-semibold'>College : </span>{educationObject.college}</div>
                                <div><span className='font-semibold'>Degree : </span>{educationObject.degree}</div>
                                <div><span className='font-semibold'>Field of Study : </span>{educationObject.fieldOfStudy}</div>
                            </div>
                            <RxCross2 className='font-bold h-[15px] w-[15px] cursor-pointer flex-shrink-0' onClick={()=> removeEducation(educationObject)} />
                        </div>
                    })}
                    <div className='flex flex-col w-full gap-[2px]' >
                        <input type="text" value={newEducation.college}  placeholder='college' onChange={(e)=> {
                            setNewEducation({...newEducation, college : e.target.value})
                            setRequiredFieldsError(false)
                            setDuplicateEducationError("")
                        }} className='border-1 p-[5px] w-full rounded-lg outline-none' />
                        <input type="text" value={newEducation.degree}  placeholder='degree' onChange={(e)=> {
                            setNewEducation({...newEducation, degree : e.target.value})
                            setRequiredFieldsError(false)
                            setDuplicateEducationError("")
                        }} className='border-1 p-[5px] w-full rounded-lg outline-none' />
                        <input type="text" value={newEducation.fieldOfStudy}  placeholder='field of study' onChange={(e)=> {
                            setNewEducation({...newEducation, fieldOfStudy : e.target.value})
                            setRequiredFieldsError(false)
                            setDuplicateEducationError("")
                        }} className='border-1 p-[5px] w-full rounded-lg outline-none' />
                        {(requiredFieldsError || duplicateEducationError) && <p className='text-red-900 font-8'>
                            {duplicateEducationError || "*All fields required"}</p>}
                    </div>
                    <button type='button' className='w-full text-center border-1 border-blue-400 rounded-lg cursor-pointer' onClick={addEducation}>Add</button>
                </div>
                <div className='flex flex-col items-start gap-[10px] border-1 rounded-lg p-[5px]'>
                    <div className='font-semibold'>Experience</div>
                    {experience &&  experience.map((expObject, i)=>{
                        return <div key={i} className='border-dashed border-1  p-[5px] w-full rounded-lg  flex  justify-between items-center '>
                            <div className='w-full flex flex-col gap-[5px]'>
                                <div><span className='font-semibold'>Tittle : </span>{expObject.title}</div>
                                <div><span className='font-semibold'>company : </span>{expObject.company}</div>
                                <div><span className='font-semibold'>Descrition : </span>{expObject.description}</div>
                            </div>
                            <RxCross2 className='font-bold h-[15px] w-[15px] cursor-pointer flex-shrink-0' onClick={()=> removeExperience(expObject)} />
                        </div>
                    })}
                    <div className='flex flex-col w-full gap-[2px]' >
                        <input type="text" value={newExperience.title}  placeholder='title' onChange={(e)=> {
                            setNewExperience({...newExperience, title : e.target.value})
                            setRequiredExperienceFieldsError(false)
                            setDuplicateExperienceError("")
                        }} className='border-1 p-[5px] w-full rounded-lg outline-none' />
                        <input type="text" value={newExperience.company}  placeholder='company' onChange={(e)=> {
                            setNewExperience({...newExperience, company : e.target.value})
                            setRequiredExperienceFieldsError(false)
                            setDuplicateExperienceError("")
                        }} className='border-1 p-[5px] w-full rounded-lg outline-none' />
                        <input type="text" value={newExperience.description}  placeholder='description' onChange={(e)=> {
                            setNewExperience({...newExperience, description : e.target.value})
                            setRequiredExperienceFieldsError(false)
                            setDuplicateExperienceError("")
                        }} className='border-1 p-[5px] w-full rounded-lg outline-none' />
                        {(requiredExperienceFieldsError || duplicateExperienceError) && <p className='text-red-900 font-8'>
                            {console.log("require experience fields error value = ", requiredExperienceFieldsError)}
                            { duplicateExperienceError || "*All fields required"}
                        </p>}
                    </div>
                    <button type='button' className='w-full text-center border-1 border-blue-400 rounded-lg cursor-pointer' onClick={addExperience}>Add</button>
                </div>
                <div className='flex justify-end'>
                    <button type='button' disabled={loading} className={`${loading ? "bg-blue-300" : "bg-blue-400"}  border-1 px-5 py-a rounded-lg text-white broder-blue-400 cursor-pointer font-semibold`} onClick={handleUpdateCurrentUser}>{loading ? "Saving...": "Save"}</button>
                </div>
            </form>
        </div>
    </div>
  </div>
}

export default EditProfile