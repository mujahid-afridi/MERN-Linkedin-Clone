import User from "../models/user.model"

export const getCurrentUser = async (req, res)=>{
    try{
        let currnetUser = await User.findById(req.currnetUserId).select("-password")
        if(!currnetUser){
            return res.status(400).json({message : "current user does not found"})
        }
        return res.status(200).json(currnetUser)
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message : "get current user error"})
    }
}