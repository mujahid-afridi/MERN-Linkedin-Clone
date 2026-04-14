import multer from 'multer'

const upload = multer({
    storage : multer.diskStorage({
        destination : (req, file, cb)=>{
            cb(null, "./public")
        },
        filename : (req, file, cb)=>{
            cb(null, file.originalname + Date.now())
        }
    }),
    limits : {fileSize : 8 * 1024 * 1024}
})


export default upload
