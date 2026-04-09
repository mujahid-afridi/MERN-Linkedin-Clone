import express from "express"
import currentUser from "../middleware/currentUser.js"
import { getCurrentUser, updateCurrentUser} from "../controllers/currentUser.controller.js"
import upload from "../middleware/multer.js"

const currentUserRouter = express.Router()

currentUserRouter.get('/currentuser', currentUser, getCurrentUser)
currentUserRouter.put('/updatecurrentuser', currentUser, upload.fields([
    {name : "profileImage", maxCount:1},
    {name : "coverImage", maxCount:1}
]), updateCurrentUser)


export default currentUserRouter