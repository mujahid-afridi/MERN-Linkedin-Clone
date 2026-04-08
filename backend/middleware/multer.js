import multer from 'multer'

const upload = multer({
    storage,
    limits : {fileSize : 5 * 1024 * 1024}
})

let storage = multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null, "./public")
    },
    filename : (req, file, cb)=>{
        cb(null, file.originalname + Date.now())
    }
})

export default upload