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
            sender : user,
            reciever : id,
            status : "pendeing"
        })

        if(existConnection){
            return res.status(400).json({message : "This connection already exist"})
        }

        let newConnection =  await Connection.create({
            sender : user,
            reciever : id
        })

        let recieverSocketId = userSocketMap.get(id)
        let senderSocketId = userSocketMap.get(newConnection.sender)
        if(recieverSocketId){
            io.to(recieverSocketId).emit("statusUpdated", {updateUserId : newConnection.sender, newStatus:"received"})
        }
        if(senderSocketId){
            io.to(senderSocketId).emit("statusUpdated", {updateUserId : id, newStatus:"pending"})
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
        await User.findByIdAndUpdate(req.currentUserId, {
            $addToSet : {connections : connection.sender._id}
        })
        await User.findByIdAndUpdate(connection.sender._id, {
            $addToSet : {connections : req.currentUserId}
        })




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
        connection.status = "rejected"
        await connection.save()
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

        await User.findByIdAndUpdate(myId, {
            $pull : {connections : myId}
        })
        await User.findByIdAndUpdate(otherUserId, {
            $pull : {connections : myId}
        })

        return res.status(200).json({message : "connection removed successfully"})
    }
    catch(error){
        return res.status(500).json({message : "removeConnection  error"})
    }
}




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
        const user = await User.findById(req.currentUserId)
            .populate("connections", "firstname lastname username headline profileImage connections")

        return res.status(200).json(user.connections)
    }
    catch(error){
        console.log(" Error in getUserConnections controller = ", error)
        return res.status(500).json({message : "server error"})
    }
}