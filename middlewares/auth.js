import passport from 'passport'
import { StatusCodes } from 'http-status-codes'
import jsonwebtoken from 'jsonwebtoken'

export const login = (req, res, next) => {
  // 呼叫驗證方式進行驗證
  // { session: false } 停用 cookie
  // (error, user, info) 對應到驗證方式 done() 的參數
  passport.authenticate('login', { session: false }, (error, user, info) => {
    console.log(error, user, info)
    if (!user || error) {
      // Missing credentials 是 LocalStrategy 的訊息
      // 代表進來的資料缺少指定欄位
      if (info.message === 'Missing credentials') {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: '資料欄位錯誤'
        })
        return
      } else if (info.message === '未知錯誤') {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: '未知錯誤'
        })
        return
      } else {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: info.message
        })
        return
      }
    }
    // 將查詢到的使用者資料放入 req 中給後面的東西使用
    req.user = user
    // 繼續下一步
    next()
  })(req, res, next)
}

export const jwt = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, data, info) => {
    console.log(error, data, info)
    if (error || !data) {
      // 是不是 JWT 的錯誤
      if (info instanceof jsonwebtoken.JsonWebTokenError) {
        if (info.name === 'TokenExpiredError') {
          // 過期
          res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: 'JWT 過期'
          })
        } else {
          // 可能是 JWT 被竄改導致用 SECRET 驗證失敗
          res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: 'JWT 驗證失敗'
          })
        }
      } else if (info.message === 'No auth token') {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: '沒有 JWT'
        })
      } else {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: info.message
        })
      }
      return
    }

    req.user = data.user
    req.token = data.token
    next()
  })(req, res, next)
}
