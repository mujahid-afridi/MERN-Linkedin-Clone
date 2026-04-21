import uploadOnCloudinary from "../config/cloudinary.js"
import { io } from "../index.js"
import Post from "../models/post.model.js"

export const getAllPosts = async(req, res)=>{
    try{
        let {skip, limit} = req.query
        let posts = await Post.find()
            .sort({createdAt : -1})
            .populate({
                path : "author",
                select : "firstname lastname username profileImage headline"
            })
            .populate({
                path : "comments.user",
                select : "firstname lastname profileImage username headline"
            })

        posts.forEach((post)=>{
            post.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        })

        let paginated = posts.slice(Number(skip), Number(skip)+Number(limit))

        return res.status(200).json(paginated)
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
            imagePath = await uploadOnCloudinary(imagePath, "image")
        }
        if(videoPath){
            videoPath = await uploadOnCloudinary(videoPath, "video")
        }

        let newPost = await Post.create({
            author : req.currentUserId,
            description,
            image : imagePath,
            video : videoPath
        })

        await newPost.save()

        let getNewPost = await Post.findById(newPost._id)
            .populate("author", "firstname lastname headline profileImage username")

        return res.status(201).json(getNewPost)
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message : "Server error"})
    }
}


export const like = async(req, res)=>{
    try{
        let postId = req.params.id
        let userId = req.currentUserId
        let post = await Post.findById(postId)
        
        if(!post){
            return res.status(400).json({message : "post does not found"})
        }

        if(post.likes.includes(userId)){
            post.likes = post.likes.filter((id)=> id!=userId)
        }else{
            post.likes.push(userId)
        }
        await post.save()

        io.emit("likeUpdated", {postId, likes:post.likes})

        const updatedPost = await Post.findById(post._id).populate("author","firstname lastname username profileImage headline")

        return res.status(200).json(updatedPost)

    }
    catch(error){
        console.log(error)
        return res.status(500).json({message : `like error = ${error}`})
    }
}

export const comment = async(req, res)=>{
    try{
        let postId = req.params.id
        let userId = req.currentUserId
        let {message} = req.body
        if(!message.trim()){
            return res.status(400).json({message : "comment cant be null"})
        }
        let post = await Post.findByIdAndUpdate(postId, {
            $push : {comments : {content : message, user : userId}}
        }, {
            returnDocument : true,
            runValidators : true
        })
        .populate({
            path : "comments.user",
            select : "firstname lastname username profileImage headline"
        })
        
        await post.save()

        const updatedPost = await Post.findById(post._id)
            .populate("author", "firstname lastname headline profileImage username")
            .populate({
                path : "comments.user",
                select : "firstname lastname headline profileImage username"
            })

        updatedPost.comments.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );


        return res.status(200).json(updatedPost)

    }
    catch(error){
        console.log(error)
        return res.status(500).json({message : `comment error = ${comment}`})
    }
}



export const getComments = async(req, res)=>{
    try{
        let postId = req.params.id
        let {skip, limit} = req.query

        let post = await Post.findById(postId)
            .populate("comments.user", "firstname lastname username profileImage headline")

        if(!post){
            return res.status(400).json({message: "post does not found"})
        }

        if(!post.comments){
            return res.status(200).json({
                comments : [],
                totalComments: post.comments?.length
            })
        }

        io.emit("commentsUpdated", {postId, comments : post.comments})

        let sortedComments = post.comments?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        let paginated = sortedComments.slice(
            Number(skip),
            Number(skip) + Number(limit)
        )

        return res.status(200).json({
            comments : paginated,
            totalComments: sortedComments.length
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message : "server error"})
    }
}