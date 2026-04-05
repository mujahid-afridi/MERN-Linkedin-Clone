import mongoose from "mongoose";
import dns from "dns"

dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("DB connected successfully")
        console.log(mongoose.connection.host)
    }
    catch(error){
        console.log(`DB connection error = ${error}`)
    }
}

export default connectDB