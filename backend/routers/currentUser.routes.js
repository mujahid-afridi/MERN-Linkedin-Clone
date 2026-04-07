import express from "express"
import currentUser from "../middleware/currentUser.js"
import { getCurrentUser } from "../controllers/currentUser.controller.js"

const currentUserRouter = express.Router()

currentUserRouter.get('/currentUser', currentUser, getCurrentUser)


export default currentUserRouter