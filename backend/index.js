import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import authRouter from "./routers/auth.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"



let app  = express()
dotenv.config()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}))

app.get("/", (req, res)=>{
    res.send("Welcom to new Linkdin MERN Project")
})

app.use("/api/auth", authRouter)




app.listen(process.env.PORT, ()=>{
    connectDB()
    console.log(`Server is listening on port ${process.env.PORT}`)
})