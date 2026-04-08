import {vs as cloudinary} from "cloudinary"
import fs from 'fs'


const uploadOnCloudinary = async (filePath)=>{
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });

    try{
        if(!filePath){
            return null
        }
        let uploadResult = await cloudinary.uploader.upload(filePath)
        fs.unlink(filePath)
        return uploadResult.secure_url
    }
    catch(error){
        fs.unlink(filePath)
        console.log(error)
    }
}

export default uploadOnCloudinary