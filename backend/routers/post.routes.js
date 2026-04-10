import express from "express"
import { createPost, getAllPosts } from "../controllers/post.controller.js"
import upload from "../middleware/multer.js"
import currentUser from "../middleware/currentUser.js"

export let postRouter = express.Router()

postRouter.get("/getallposts", currentUser,  getAllPosts)
postRouter.post("/createpost", currentUser,  upload.fields([
    {name: "image", maxCount : 1},
    {name: "video", maxCount : 1,}
]), createPost)