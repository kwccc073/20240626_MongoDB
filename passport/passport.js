import passport from 'passport'
import passportLocal from 'passport-local'
import passportJWT from 'passport-jwt'
import bcrypt from 'bcrypt'
import User from '../models/user.js'

// 使用驗證策略寫自己的驗證方式
// passport.use(驗證方式, 驗證策略)
passport.use('login', new passportLocal.Strategy({
  // new passportLocal.Strategy 驗證有沒有 username 和 password 欄位
  // 使用 usernameField 和 passwordField 修改驗證欄位
  usernameField: 'name',
  passwordField: 'password'
}, async (name, password, done) => {
  // 驗證策略執行成功後的 function
  // passportLocal 成功的條件是進來的資料有指定的欄位
  try {
    // 查詢有沒有符合名字的使用者
    const user = await User.findOne({ name })
    if (!user) throw new Error('NAME')

    // 檢查密碼
    if (!bcrypt.compareSync(password, user.password)) throw new Error('PW')

    // 驗證完成，下一步
    // done(錯誤, 資料, info)
    return done(undefined, user, undefined)
  } catch (error) {
    console.log(error)
    if (error.message === 'NAME') {
      return done(undefined, undefined, { message: '帳號不存在' })
    } else if (error.message === 'PW') {
      return done(undefined, undefined, { message: '密碼錯誤' })
    } else {
      return done(undefined, undefined, { message: '未知錯誤' })
    }
  }
}))

passport.use('jwt', new passportJWT.Strategy({
  // 設定擷取 JWT 的位置
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  // 驗證用的 secret
  secretOrKey: process.env.JWT_SECRET,
  // 讓後面的 function 能取得 req
  passReqToCallback: true
}, async (req, payload, done) => {
  // req 請求資訊，有設定 passReqToCallback 才能用
  // payload 解析後的內容
  // done 下一步
  try {
    // 因為沒有辦法取的原始 JWT，所以需要自己想辦法
    // const token = req.headers.authorization.split(' ')[1]
    const token = passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()(req)
    // 查詢有沒有使用者，符合解析出的 id，且有這個 jwt
    const user = await User.findOne({ _id: payload._id, tokens: token })
    if (!user) throw new Error('JWT')
    return done(undefined, { user, token }, undefined)
  } catch (error) {
    console.log(error)
    if (error.message === 'JWT') {
      return done(undefined, undefined, { message: '查無使用者' })
    } else {
      return done(undefined, undefined, { message: '未知錯誤' })
    }
  }
}))
