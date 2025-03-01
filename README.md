# 20240626_MongoDB
## 本日重點
* 登入、登出等功能

有教upload.js ==待確認==
## 課程內容
* 各種指令
    * npm init --yes
    * npm i dotenv express mongoose http-status-codes
    * npm init @eslint/config@1.0
    * npm i bcrypt
    * npm i -D nodemon
    * npm i passport passport-local passport-jwt jsonwebtoken
* yarn示範 (00:07:30)
* pnpm示範 (00:12:25)
* 資料夾models 
    * user.js (00:15:08)
        * schema
            * 帳號
            * 密碼
            * 大頭貼
            * tokens (00:30:40)
        * 密碼加密 (00:33:00)
            * bcrypt套件
* index.js (00:45:29)
* 資料夾routes
    * user.js (00:52:10)
* 資料夾controllers
    * user.js (00:53:07)
        * 註冊使用者 - create (00:59:00)
        * postman測試 (01:04:54)
        * 登入 - login
            * JWT概念 (01:06:14)
            * 套件passport (01:09:59)
* 資料夾passport (01:13:56)