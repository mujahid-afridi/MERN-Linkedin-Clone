import jwt from "jsonwebtoken"

const genToken = async (userId)=>{
    try{
        let token =  jwt.sign({userId}, process.env.SECRET_KEY, {expiresIn : "10d"})
        return token
    }
    catch(error){
        console.log(error)
    }
}

export default genToken