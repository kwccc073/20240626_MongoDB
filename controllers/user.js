import User from '../models/user.js'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken' // 簽發jwt用的套件

// 註冊-----------------------------------------------------------------
export const create = async (req, res) => {
  try {
    const result = await User.create(req.body)
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    console.error(error)
    if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: '使用者名重複'
      })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message

      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤'
      })
    }
  }
}

// 登入-----------------------------------------------------------------
// 這裡面的req.user都來自auth.js的login
export const login = async (req, res) => {
  try {
    // 簽發一個新的token---------------
    // jwt.sign(要保存的資料, SECRET, 設定)
    const token = jwt.sign(
      { _id: req.user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // 7天過期
    )
    
    req.user.tokens.push(token)
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: token
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

// 取得使用者自己的資料------------------------------
export const profile = async (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: '',
    result: {
      name: req.user.name,
      avatar: req.user.avatar
    }
  })
}

// 登出---------------------------------------------- 
// 重點：把token移除
export const logout = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex(token => token === req.token)
    req.user.tokens.splice(idx, 1)
    await req.user.save()

    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

// 上傳大頭貼-----------------------------------------------
export const avatar = async (req, res) => {
  try {
    /* req.file 表示上傳的檔案的資訊，會根據 upload.js 寫的東西而有不同的結果
       upload.single() -> req.file
       upload.array() -> req.files[索引] （陣列形式）
       upload.fields() -> req.files[欄位名稱][索引] （陣列形式，但會再分欄位）
     */
    console.log(req.file)
    req.user.avatar = req.file.path // req.file.path -> 上傳至cloudinary後檔案的網址
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: req.user.avatar
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}
