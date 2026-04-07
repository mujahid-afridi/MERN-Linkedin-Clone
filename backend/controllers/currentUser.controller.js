import User from "../models/user.model.js"

export const getCurrentUser = async (req, res)=>{
    try{
        let currentUser = await User.findById(req.currentUserId).select("-password")
        if(!currentUser){
            return res.status(400).json({message : "current user does not found"})
        }
        return res.status(200).json(currentUser)
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message : "get current user error"})
    }
}