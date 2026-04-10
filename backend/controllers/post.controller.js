import uploadOnCloudinary from "../config/cloudinary.js"
import Post from "../models/post.model.js"


export const getAllPosts = async(req, res)=>{
    try{
        let posts = await Post.find().sort({createdAt : -1})
        return res.status(200).json(posts)
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message : "Server error"})
    }
}

export const createPost = async(req, res)=>{
    try{
        let {description} = req.body
        let imagePath = req.files?.image?.[0].path
        let videoPath = req.files?.video?.[0].path

        if(!description.trim() && !imagePath && !videoPath){
            return res.status(400).json({message : "At least one field (description or image or video) required"})
        }

        if(imagePath){
            imagePath = await uploadOnCloudinary(imagePath)
        }
        if(videoPath){
            videoPath = await uploadOnCloudinary(videoPath)
        }

        let newPost = await Post.create({
            author : req.currentUserId,
            description,
            image,
            video
        })

        return res.status(201).json({newPost})
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message : "Server error"})
    }
}
