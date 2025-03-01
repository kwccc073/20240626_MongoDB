import { Schema, model, Error } from 'mongoose'
import bcrypt from 'bcrypt'

const schema = new Schema({
  name: {
    type: String,
    required: [true, '使用者名稱必填'],
    unique: true
  },
  password: {
    type: String,
    required: [true, '使用者密碼必填']
  },
  // 大頭貼
  avatar: {
    type: String,
    // 預設值
    default () {
      // this.name 指向同一個資料的 name 欄位
      return `https://api.multiavatar.com/${this.name}`
    }
  },
  // 登入驗證的東西：使用者登入後會得到一組驗證用的序號，這個序號可以幫助取資料、判斷有無權限之類的
  tokens: {
    type: [String] // 文字陣列
  }
})

// 加密 (筆記參考0621課程)------------------------------------------------------------------------------
schema.pre('save', function (next) {
  const user = this
  if (user.isModified('password')) {
    if (user.password.length > 0) {
      user.password = bcrypt.hashSync(user.password, 10)
    } else {
      const error = new Error.ValidationError()
      error.addError('password', new Error.ValidatorError({ message: '使用者密碼必填' }))
      next(error)
      return
    }
  }
  next()
})

export default model('users', schema)
