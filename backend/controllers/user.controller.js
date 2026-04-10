import User from "../models/user.model.js"
import uploadOnCloudinary from "../config/cloudinary.js"

export const getCurrentUser = async (req, res)=>{
    try{
        let currentUser = await User.findById(req.currentUserId).select("-password")
        if(!currentUser){
            return res.status(400).json({message : "current user does not found"})
        }
        return res.status(200).json(currentUser)
    }
    catch(error){
        console.log("Error in getting current User = ",error)
        return res.status(500).json({message : "get current user error"})
    }
}

export const updateUserProfile = async(req, res)=>{
    try{
        let {firstname, lastname, username, location, headline, gender} = req.body
        let skills = JSON.parse(req.body?.skills || "[]")
        let experience = JSON.parse(req.body?.experience || "[]")
        let education = JSON.parse(req.body?.education || "[]")
        let profileImage = req.files?.profileImage?.[0].path
        let coverImage = req.files?.coverImage?.[0].path
        if(profileImage){
            profileImage =  await uploadOnCloudinary(profileImage)
        }
        if(coverImage){
            coverImage =  await uploadOnCloudinary(coverImage)
        }

        let updatedUser =  await User.findByIdAndUpdate(req.currentUserId, {firstname, lastname, username, location,
             headline, skills, education, experience, gender, profileImage, coverImage}, {
                returnDocument : 'after',
                runValidators : true
             }).select("-password")

        return res.status(200).json(updatedUser)
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message : "Update profiel error"})
    }
}