import express from "express"
import { getConnection, getConnectionRequests, getConnectionStatus, getUserConnections, rejectConnection, removeConnection, sendConnection } from "../controllers/connection.controller.js"
import currentUser from "../middleware/currentUser.js"

const connectionRouter = express.Router()


connectionRouter.get("/send/:id", currentUser, sendConnection)
connectionRouter.get("/accept/:connectionId", currentUser, getConnection)
connectionRouter.get("/reject/:connectionId", currentUser, rejectConnection)
connectionRouter.get("/getstatus/:userId", currentUser, getConnectionStatus)
connectionRouter.get("/remove/:userId", currentUser, removeConnection)
connectionRouter.get("/requests", currentUser,  getConnectionRequests)
connectionRouter.get("/", currentUser,  getUserConnections)



export default connectionRouter