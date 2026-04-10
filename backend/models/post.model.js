import mongoose from "mongoose";
import User from "./user.model.js";


const postSchema = new mongoose.Schema({
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    description : {
        type : String,
        default : ""
    },
    image : {
        type : String,
        default : ""
    },
    video : {
        type : String,
        default : ""
    },
    likes :[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ],
    comments : [
        {
            content : {type : String},
            user : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "User"
            }
        }
    ]
}, {timestamps : true})

const Post = mongoose.model("Post", postSchema)
export default Post