import express from "express"
import currentUser from "../middleware/currentUser.js"
import upload from "../middleware/multer.js"
import { getCurrentUser, updateUserProfile } from "../controllers/user.controller.js"

const currentUserRouter = express.Router()

currentUserRouter.get('/currentuser', currentUser, getCurrentUser)
currentUserRouter.put('/updatecurrentuser', currentUser, upload.fields([
    {name : "profileImage", maxCount:1},
    {name : "coverImage", maxCount:1}
]), updateUserProfile)


export default currentUserRouter