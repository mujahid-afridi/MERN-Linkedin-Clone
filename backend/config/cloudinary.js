import {v2 as cloudinary} from "cloudinary"
import fs from 'fs'


const uploadOnCloudinary = async (filePath, type)=>{
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });

    try{
        let uploadResult;
        
        if(!filePath){
            return null
        }

        if(type == "video"){
            uploadResult = await cloudinary.uploader.upload(filePath, {
                resource_type : "video"
            })
        }else{
            uploadResult = await cloudinary.uploader.upload(filePath)
        }

        fs.unlinkSync(filePath)
        return uploadResult.secure_url
    }
    catch(error){
        fs.unlinkSync(filePath)
        console.log(error)
    }
}

export default uploadOnCloudinary