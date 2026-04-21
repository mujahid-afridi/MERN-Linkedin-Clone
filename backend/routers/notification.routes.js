import express from "express"
import currentUser from "../middleware/currentUser.js"
import { createNotification, deleteNotification, getNotifications, removeAllNotifications } from "../controllers/notification.controller.js"

const notificationRouter = express.Router()

notificationRouter.post("/create/:type", currentUser, createNotification)
notificationRouter.get("/getnotifications", currentUser, getNotifications)
notificationRouter.delete("/deleteone/:id", currentUser, deleteNotification)  //delete only one notification
notificationRouter.delete("/", currentUser, removeAllNotifications)  //delete all notifications of that user



export default notificationRouter