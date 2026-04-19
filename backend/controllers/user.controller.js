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



export const getUserProfile = async(req, res)=>{
    try{
        const userId = req.params.id
        let user = await User.findById(userId)
            .select("-password")
            .populate("connections", "firstname lastname headline username email profileImage coverImage")

        if(!user){
            return res.status(400).json({message : "user does not exist"})
        }

        return res.status(200).json(user)

    }
    catch(error){
        console.log("getUserProfile controller error = ",error)
        return res.status(500).json({message : "getUserProfile  error"})
    }
}


export const search = async(req, res)=>{
    try{
        let {query} = req.query
        if(!query){
            return res.status(400).json({message : "query is required"})
        }
        let users = await User.find({
            $or : [
                {firstname : {$regex : query, $options:"i"}},
                {lastname : {$regex : query, $options : "i"}},
                {username : {$regex: query, $options: "i"}},
                {skills : {$in: [query]}}
            ]
        })

        return res.status(200).json(users)
    }
    catch(error){
        console.log("search controller error = ",error)
        return res.status(500).json({message : "search error"})
    }
}


export const getSuggestedUsers = async(req, res)=>{
    try{
        let currentUser = await User.findById(req.currentUserId).select("connections")
        console.log("currentUser in backend= ", currentUser)
        let suggestedUsers = await User.find({
            _id:{
                $ne:req.currentUserId,
                $nin : currentUser.connections
            }
        }).select("firstname lastname username headline profileImage")
        console.log("suggestedusers in backend = ", suggestedUsers)
        return res.status(200).json(suggestedUsers)
    }
    catch(error){
        console.log("getSuggestedUser controller error")
        return res.status(500).json({message : "getSuggestedUser error"})
    }
}