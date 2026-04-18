// import { Connection } from "mongoose"
import User from "../models/user.model.js"
import Connection from "../models/connection.model.js"
import { io, userSocketMap } from "../index.js"


export const sendConnection = async(req, res)=>{
    try{
        let {id} = req.params   //the Id of user to which you want send connection request

        let user = await User.findById(id)

        if(id == req.currentUserId){
            return res.status(400).json({message : "can't send connection reques to yourself"})
        }

        if(user.connections?.includes(id)){
            return res.status(400).json({message : "you are already connect"})
        }

        let existConnection =  await Connection.findOne({
            sender : req.currentUserId,
            reciever : id,
            status : "pending"
        })

        if(existConnection){
            return res.status(400).json({message : "This connection already exist"})
        }

        let newConnection =  await Connection.create({
            sender : req.currentUserId,
            reciever : id
        })

        let recieverSocketId = userSocketMap.get(id)
        let senderSocketId = userSocketMap.get(req.currentUserId)
        if(recieverSocketId){
            io.to(recieverSocketId).emit("statusUpdate", {updatedUserId : req.currentUserId, newStatus : "received"})
        }
        if(senderSocketId){
            io.to(senderSocketId).emit("statusUpdate", {updatedUserId : id, newStatus : "pending"})
        }



        return res.status(201).json(newConnection)
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message : `send connection error : ${error}`})
    }
}




export const getConnection = async (req, res)=>{
    try{
        let {connectionId} = req.params
        let connection = await Connection.findById(connectionId)

        if(!connection){
            return res.status(400).json({message : "connection does not found"})
        }

        if(connection.status !== "pending"){
            return res.status(400).json({message : "request under process"})
        }

        connection.status = "accepted"
        await connection.save()

        let updatedReciever = await User.findByIdAndUpdate(req.currentUserId, {
            $addToSet : {connections : connection.sender._id}},
            {new : true}
        ).populate("connections", "firstname lastname headline username profileImage")
        let updatedSender =  await User.findByIdAndUpdate(connection.sender._id, {
            $addToSet : {connections : req.currentUserId}},
            {new : true}
        ).populate("connections", "firstname lastname headline username profileImage")


        let recieverSocketId = userSocketMap.get(connection.reciever.toString())
        let senderSocketId = userSocketMap.get(connection.sender.toString())
        if(recieverSocketId){
            io.to(recieverSocketId).emit("statusUpdate", {updatedUserId:connection.sender._id, newStatus : "disconnect"})
            io.to(recieverSocketId).emit("connectionUpdate", {connections : updatedReciever.connections})
        }
        if(senderSocketId){
            io.to(senderSocketId).emit("statusUpdate", {updatedUserId:req.currentUserId, newStatus : "disconnect"})
            io.to(senderSocketId).emit("connectionUpdate", {connections : updatedSender.connections})
        }

        return res.status(200).json({message : "connection accepted"})

    }
    catch(error){
        return res.status(500).json({message : "connection accepted error"})
    }
}





export const rejectConnection = async(req, res)=>{
    try{
        let {connectionId} = req.params
        let connection = await Connection.findById(connectionId)
        if(!connection){
            return res.status(400).json({message : "connection does not found"})
        }
        if(connection.status != "pending"){
            return res.status(400).json({message : "request under process"})
        }

        await Connection.findByIdAndDelete(connectionId)

        let recieverSocketId = userSocketMap.get(req.currentUserId)
        let senderSocketId = userSocketMap.get(connection.sender.toString())
        if(recieverSocketId){
            io.to(recieverSocketId).emit("statusUpdate", {updatedUserId:connection.sender._id, newStatus:"connect"})
        }
        if(senderSocketId){
            io.to(senderSocketId).emit("statusUpdate", {updatedUserId:req.currentUserId, newStatus : "connect"})
        }

        return res.status(200).json({message : "connection rejected"})
    }
    catch(error){
        return res.status(500).json({message : "connection accepted error"})
    }
}




export const getConnectionStatus = async (req, res)=>{
    try{
        const targetUserId = req.params.userId
        const currentUserId = req.currentUserId

        let currentUser = await User.findById(currentUserId)

        if(currentUser.connections.includes(targetUserId)){
            return res.json({status : "disconnect"})
        }
        const pendingRequest = await Connection.findOne({
            $or : [
                {sender : currentUserId, reciever : targetUserId},
                {sender : targetUserId, reciever: currentUserId},
            ],
            status : "pending"
        })
        if(pendingRequest){
            if(pendingRequest.sender.toString() === currentUserId.toString()){
                return res.json({status : "pending"})
            }else{
                return res.json({status : "received", requestId: pendingRequest._id})
            }

        }

        return res.json({status : "connect"})
    }
    catch(error){
        return res.status(500).json({message : "getConnection status error"})
    }
}




export const removeConnection = async (req, res)=>{
    try{
        const myId = req.currentUserId
        const otherUserId = req.params.userId

        let updatedCurrentUser =  await User.findByIdAndUpdate(myId, 
            {$pull : {connections : otherUserId}},
            {new: true}
        ).populate("connections", "firstname lastname headline username profileImage")
        let updatedOtherUser = await User.findByIdAndUpdate(otherUserId, 
            {$pull : {connections : myId}},
            {new: true}
        ).populate("connections", "firstname lastname headline username profileImage")

        let recieverSocketId  = userSocketMap.get(otherUserId.toString())
        let senderSocketId  = userSocketMap.get(myId.toString())
        if(recieverSocketId){
            io.to(recieverSocketId).emit("statusUpdate", {updatedUserId: myId, newStatus:"connect"})
            io.to(recieverSocketId).emit("connectionUpdate", {connections : updatedOtherUser.connections})
        }
        if(senderSocketId){
            io.to(senderSocketId).emit("statusUpdate", {updatedUserId:otherUserId, newStatus:"connect"})
            io.to(senderSocketId).emit("connectionUpdate", {connections : updatedCurrentUser.connections})
        }

        return res.status(200).json({message : "connection removed successfully"})
    }
    catch(error){
        return res.status(500).json({message : "removeConnection  error"})
    }
}





//fetch all pending requests 
export const getConnectionRequests = async(req, res)=>{
    try{
        let requests = await Connection.find({
            reciever : req.currentUserId,
            status : "pending"
        }).populate("sender", "firstname lastname username profileImage headline")

        return res.status(200).json(requests)
    }
    catch(error){
        console.log(" Error in getConnectionRequests controller = ", error)
        return res.status(500).json({message : "server error"})
    }
}





export const getUserConnections = async(req, res)=>{
    try{
        let {userId} = req.params
        const user = await User.findById(userId)
            .populate("connections", "firstname lastname username headline profileImage connections")
        
        return res.status(200).json(user.connections)
    }
    catch(error){
        console.log(" Error in getUserConnections controller = ", error)
        return res.status(500).json({message : "server error"})
    }
}