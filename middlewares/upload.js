import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { StatusCodes } from 'http-status-codes'

// 設定cloudinary---------------------------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

// 設定上傳套件---------------------------------------------
const upload = multer({
  // storage -> 當收到檔案之後要放哪裡
  storage: new CloudinaryStorage({ cloudinary }),
  // fileFilter (){} 寫過濾的function
  // req -> 收到的請求；file -> 收到的檔案；callback -> 類似next（表示處理完）
  fileFilter (req, file, callback) {
    console.log(file)
    // 如果檔案是 jpeg 或 png
    if (['image/jpeg', 'image/png'].includes(file.mimetype)) {
      // callback(拋出的錯誤, 是否允許上傳)
      callback(null, true)
    } else {
      callback(new Error('FORMAT'), false)
    }
  },
  limits: {
    // 限制最大尺寸
    fileSize: 1024 * 1024 // 單位是b
  }
})

// 檔案上傳的function--------------------------------------------------
export default (req, res, next) => {
  // 根據需求來決定upload後面怎麼寫
  /* 接收 1 個 image 欄位的檔案
     upload.single('image')  ---> 會收到參數req.file */
  /* 接收多個，如：接收 10 個 image 欄位的檔案
     upload.array('image', 10)  ---> 會收到參數req.files[0] */
  /* 接收多個欄位，可以指定每個欄位要收幾個檔案，如：接收 1 個 avatar 欄位和 5 個 photo 欄位的檔案
     upload.fields([
       { name: 'avatar', maxCount: 1 },
       { name: 'photo', maxCount: 5 }
     ]) 
     ---> 會收到參數req.files.avatar[1]、req.files.photo[0] */

  // 只接收大頭貼欄位
  upload.single('avatar')(req, res, error => {
    // error -> 執行upload.single('avatar')發生的錯誤
    console.log(error)
    // 處理錯誤----------------------------------
    if (error instanceof multer.MulterError) {
      // 上傳錯誤
      let message = '上傳錯誤'
      
      // LIMIT_FILE_SIZE是這個套件原本就有的錯誤，只有上面limits有設定的才需要寫出來做錯誤處理
      if (error.code === 'LIMIT_FILE_SIZE') {
        message = '檔案太大'
      }

      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message
      })
    } else if (error) {
      // 其他錯誤--------------
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
