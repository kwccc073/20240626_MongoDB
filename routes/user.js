import { Router } from 'express'
import { create, login, profile, logout, avatar } from '../controllers/user.js'
import * as auth from '../middlewares/auth.js' // 一次匯入
import upload from '../middlewares/upload.js'

const router = Router()

// auth.jwt -> 驗證 （如果是登入後才能做的動作，通常都會寫這個來判斷是否有權限）

router.post('/', create)
router.post('/login', auth.login, login)
router.get('/profile', auth.jwt, profile) // 取使用者自己的資料
router.delete('/logout', auth.jwt, logout) // 登出
router.patch('/avatar', auth.jwt, upload, avatar) // 上船大頭貼

export default router
