import jwt from "jsonwebtoken"

const currentUser = (req, res, next) => {
    try{
        let {token} = req.cookies
        if(!token){
            return res.status(400).json({message : "user does not have token!"})
        }
        let verifyToken = jwt.verify(token, process.env.SECRET_KEY)
        req.currentUserId = verifyToken._id
        next()
    }
    catch(error){
        if(error.name == "JsonWebTokenError"){
            return res.status(401).json({ message: "Invalid token" });
        }
        if(error.name == "TokenExpiredError"){
            return res.status(401).json({ message: "Token expired" });
        }

        return res.status(500).json({message : "sever error"})
    }
}

export default currentUser