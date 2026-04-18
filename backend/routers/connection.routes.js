import express from "express"
import { getConnection, getConnectionRequests, getConnectionStatus, getUserConnections, rejectConnection, removeConnection, sendConnection } from "../controllers/connection.controller.js"
import currentUser from "../middleware/currentUser.js"

const connectionRouter = express.Router()


connectionRouter.post("/send/:id", currentUser, sendConnection)
connectionRouter.put("/accept/:connectionId", currentUser, getConnection) //accept connection request rout
connectionRouter.put("/reject/:connectionId", currentUser, rejectConnection)
connectionRouter.get("/getstatus/:userId", currentUser, getConnectionStatus)
connectionRouter.delete("/remove/:userId", currentUser, removeConnection)
connectionRouter.get("/requests", currentUser,  getConnectionRequests) // get all pending requests from connection collection
connectionRouter.get("/:userId", currentUser,  getUserConnections) //get total connection of user



export default connectionRouter