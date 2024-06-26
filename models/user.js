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
  avatar: {
    type: String,
    default () {
      // this.name 指向同一個資料的 name 欄位
      return `https://api.multiavatar.com/${this.name}`
    }
  },
  tokens: {
    type: [String]
  }
})

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
