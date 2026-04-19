import Post from "../models/post.model.js"
import Notification from "../models/notification.model.js"



export const createNotification = async(req , res )=>{
    try{
        let sender = req.currentUserId
        let {type} = req.params
        let notification;
        if(type === "like" || type === "comment"){
            let {postId} = req.body
            let post = await Post.findById(postId).select("author")
            if(!post){
                return res.status(400).json({message : "post does not found"})
            }

            if(post.author.toString() === sender.toString()){
                return res.status(200).json({message: "No notification for self"})
            }

            notification = await Notification.create({
                receiver : post.author,
                type : type,
                relatedUser : sender,
                relatedPost : postId
            })
        }else if(type === "connectionAccepted"){
            let {receiverId} = req.body
            if (receiverId === sender) {
                return res.status(200).json({ message: "No self notification" })
            }
            notification = await Notification.create({
                receiver : receiverId,
                type : type,
                relatedUser : sender
            })
        }else{
            return res.status(400).json({message : "type is wrong for notification"})
        }

        return res.status(201).json({message : "notification created successfully"})
    }
    catch(error){
        console.log("createNotification controller error")
        return res.status(500).json({message : `createNotification error =  ${error}`})
    }
}



export const getNotifications = async(req, res)=>{
    try{
        let notifications = await Notification.find({receiver : req.currentUserId})
            .populate("relatedUser", "firstname lastname headline username profileImage")
            .populate("relatedPost", "image video description")
        if(!notifications){
            return res.status(400).json([])
        }
        return res.status(200).json(notifications)
    }
    catch(error){
        console.log("getNotification controller error")
        return res.status(500).json({message : error})
    }
}


export const deleteNotification = async(req, res)=>{
    try{
        let {id} = req.params
        await Notification.findByIdAndDelete(id)
        
        return res.status(200).json({message : "notification deleted successfully"})
    }
    catch(error){
        console.log("deleteNotification controller error")
        return res.status(500).json({message : error})
    }
}



export const removeAllNotifications = async (req, res)=>{
    try{
        await Notification.deleteMany({receiver : req.currentUserId})
        return res.status(200).json({message : "all notifications deleted successfully"})
    }
    catch(error){
        console.log("removeAllNotifications controller error")
        return res.status(500).json({message : error})
    }
}