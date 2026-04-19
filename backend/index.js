import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import authRouter from "./routers/auth.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import currentUserRouter from "./routers/currentUser.routes.js"
import { postRouter } from "./routers/post.routes.js"
import connectionRouter from "./routers/connection.routes.js"
import http from 'http'
import {Server} from 'socket.io'
import notificationRouter  from "./routers/notification.routes.js"

let app  = express()
let server =  http.createServer(app)
export const io = new Server(server, {
    cors : ({
        origin : "http://localhost:5173",
        credentials : true
    })
})

dotenv.config()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}))



app.use("/api/auth", authRouter)
app.use("/api/user", currentUserRouter)
app.use("/api/post", postRouter)
app.use("/api/connection", connectionRouter)
app.use("/api/notification", notificationRouter)

export const userSocketMap = new Map()
io.on("connection", (socket)=>{
    console.log("User connected : ", socket.id)

    socket.on("register", (userId)=>{
        userSocketMap.set(userId, socket.id)
        console.log("userSocketMap = ", userSocketMap)
    })

    socket.on("disconnect", ()=>{
        console.log("User disconnected : ", socket.id)
    })
})

server.listen(process.env.PORT, ()=>{
    connectDB()
    console.log(`Server is listening on port ${process.env.PORT}`)
}) 