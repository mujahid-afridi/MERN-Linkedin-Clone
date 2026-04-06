import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcrypt"


export const signup = async (req, res)=>{
    try{
        let {firstname, lastname, username, email, password} = req.body
        const existEmail =await User.findOne({email})
        if(existEmail){
            return res.status(400).json({message : "email already exist !"})
        }
        const existUserName = await User.findOne({username})
        if(existUserName){
            return res.status(400).json({message : "username already exist !"})
        }
        if(password.length  < 8){
            return res.status(400).json({message : "password must be at least 8 character."})
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            firstname, 
            lastname, 
            username, 
            email, 
            password : hashPassword
         })

        let token = await genToken(user._id)
        res.cookie("token", token, {
            httpOnly : true,
            maxAge: 10*24*60*60*1000,
            sameSite : "strict",
            secure : process.env.NODE_ENVIRONMNET==="PRODUCTION"
        })
        
        return res.status(201).json(user)
        
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message : "signup error"})
    }
}


export const signin = async (req, res)=>{
    try{
        const {email, password} = req.body
        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message : "user does not found"})
        }
        let isMatch =await  bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({message : "password does not match"})
        }
        let token = await genToken(user._id)
        res.cookie("token", token, {
            httpOnly:true,
            maxAge : 10*24*60*60*1000,
            sameSite : "strict",
            secure : process.env.NODE_ENVIRONMNET==="PRODUCTION"
        })
        return res.status(200).json(user)
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message : "signin error"})
    }
}


export const logout = async (req, res)=>{
    try{
        res.clearCookie("token")
        return res.status(200).json({message : "logout successfully"})
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message : "logout error"})
    }
}