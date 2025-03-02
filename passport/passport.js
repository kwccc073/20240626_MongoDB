import passport from 'passport'
// 引入策略
import passportLocal from 'passport-local'
import passportJWT from 'passport-jwt'
import bcrypt from 'bcrypt' // 密碼驗證用
import User from '../models/user.js'

// 使用驗證策略寫自己的驗證方式
/* 定義login這個驗證方式，使用passportLocal驗證策略-------------------------------
    1. passportLocal驗證策略預設會驗證username、password這兩個欄位
    2. 驗證成功會執行下方自己寫的function；驗證失敗會進到middleware (資料夾middlewares>auth.js)
    3. done() 表示進到下一步 -> middleware (資料夾middlewares>auth.js)
*/
// passport.use(驗證方式, 驗證策略)
passport.use('login', new passportLocal.Strategy({
  // new passportLocal.Strategy => 預設會去驗證有沒有 帳號(username) 和 密碼(password) 欄位
  // 但在model中定義帳號是name、密碼是password，所以用usernameField 和 passwordField去修改欄位名稱為name和password
  usernameField: 'name',
  passwordField: 'password'
}, async (name, password, done) => {
  // 驗證策略執行成功後的 function-----------------------------------------
  // passportLocal 成功的條件是進來的資料有指定的欄位
  // name、password => usernameField和passwordField收到的值；done => 繼續下一步
  try {
    // 查詢有沒有符合名字的使用者--------------------
    const user = await User.findOne({ name }) // 原為{ name: name }，因為key跟value一樣，可以省略寫成{ name }
    if (!user) throw new Error('NAME') // 找不到就拋錯誤

    // 檢查密碼--------------------------------------
    if (!bcrypt.compareSync(password, user.password)) throw new Error('PW') // 不對就拋錯誤

    // 驗證完成，下一步-------------------------------
    // done(錯誤, 要傳出的資料, info)
    return done(undefined, user, undefined)
  } catch (error) {
    // 錯誤處理-------------------------------------------------------------
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

// 定義jwt這個驗證方式，使用passportJWT驗證策略-------------------------------
// passportJWT驗證策略：先驗證有沒有JWT，再驗證JWT有沒有在期限內、JWT的secret有沒有被竄改過

passport.use('jwt', new passportJWT.Strategy({
  // 設定擷取 JWT 的位置
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  // 驗證用的 secret
  secretOrKey: process.env.JWT_SECRET,
  /* passportJWT驗證策略，他不會告訴你收到的JWT，只會給你解析後的東西，所以要這樣做：
      1. 讓後面的 function 能取得 req */
  passReqToCallback: true
}, async (req, payload, done) => {
  // 2. req -> 請求資訊，有設定 passReqToCallback 才能用
  // payload -> 解析後的資料；done -> 下一步
  try {
    // 3. 取得req裡面原始的token
    // const token = req.headers.authorization.split(' ')[1] // 寫法1：用空白去切割
    const token = passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()(req) // 寫法2：passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()會return一個function，加上(req)表示執行這個function
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
