import { Router } from 'express'
import { create, login, profile, logout, avatar } from '../controllers/user.js'
import * as auth from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'

const router = Router()

router.post('/', create)
router.post('/login', auth.login, login)
router.get('/profile', auth.jwt, profile)
router.delete('/logout', auth.jwt, logout)
router.patch('/avatar', auth.jwt, upload, avatar)

export default router
