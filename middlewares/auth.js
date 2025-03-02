import passport from 'passport'
import { StatusCodes } from 'http-status-codes'
import jsonwebtoken from 'jsonwebtoken'

// 登入---------------------------------------------------------------------------
// middlewares一定要寫三個參數：req, res, next
// express會根據有幾個參數來判斷這個東西要幹嘛：2個->處理一般function；3個->middleware；4個->處理middle發生的錯誤
export const login = (req, res, next) => {
  /* passport.authenticate() 呼叫驗證方式進行驗證---------------------------------------------------------
      各種錯誤處理
      */
  // { session: false } -> 不要保存 cookie
  // passport.js裡該驗證方式的 done() 的參數會被丟到(error, user, info)裡面
  passport.authenticate('login', { session: false }, (error, user, info) => {
    console.log(error, user, info)
    // 如果沒有使用者||有錯誤
    if (!user || error) {
      // Missing credentials 是 LocalStrategy 的訊息，代表進來的資料缺少指定欄位
      if (info.message === 'Missing credentials') {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: '資料欄位錯誤'
        })
        return // 一定要有return，若沒有會進到下一步繼續處理
      } else if (info.message === '未知錯誤') {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: '未知錯誤'
        })
        return // 一定要有return，若沒有會進到下一步繼續處理
      } else {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: info.message
        })
        return // 一定要有return，若沒有會進到下一步繼續處理
      }
    }
    // 將查詢到的使用者(來自done)資料放入 req 中，讓後面處理可以使用使用者資料
    req.user = user
    // 繼續下一步
    next()
  })(req, res, next)
}

// 驗證jwt --------------------------------------------------------------------
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
