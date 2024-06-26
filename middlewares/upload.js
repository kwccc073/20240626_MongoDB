import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { StatusCodes } from 'http-status-codes'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

const upload = multer({
  storage: new CloudinaryStorage({ cloudinary }),
  fileFilter (req, file, callback) {
    console.log(file)
    if (['image/jpeg', 'image/png'].includes(file.mimetype)) {
      // callback(拋出的錯誤, 是否允許上傳)
      callback(null, true)
    } else {
      callback(new Error('FORMAT'), false)
    }
  },
  limits: {
    fileSize: 1024 * 1024
  }
})

export default (req, res, next) => {
  // 接收 1 個 image 欄位的檔案
  // upload.single('image')  ---> req.file
  // 接收 10 個 image 欄位的檔案
  // upload.array('image', 10)  ---> req.files[0]
  // 接收 1 個 avatar 欄位和 5 個 photo 欄位的檔案
  // upload.fields([
  //   { name: 'avatar', maxCount: 1 },
  //   { name: 'photo', maxCount: 5 }
  // ])
  // req.files.avatar[1]
  // req.files.photo[0]
  upload.single('avatar')(req, res, error => {
    console.log(error)
    if (error instanceof multer.MulterError) {
      // 上傳錯誤
      let message = '上傳錯誤'
      if (error.code === 'LIMIT_FILE_SIZE') {
        message = '檔案太大'
      }
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message
      })
    } else if (error) {
      // 其他錯誤
      if (error.message === 'FORMAT') {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: '檔案格式錯誤'
        })
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: '未知錯誤'
        })
      }
    } else {
      next()
    }
  })
}
