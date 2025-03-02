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
    * npm i multer cloudinary multer-storage-cloudinary
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
        * 登入 - login (02:01:07)
            * JWT
                * expiresIn (02:04:45)
* 驗證策略 
    * JWT概念 (01:06:14)
    * 套件passport (01:09:59)
    * **login**
        * 使用驗證策略寫自己的驗證方式 - 資料夾passport > passport.js 的 login (01:13:56)
        * 呼叫驗證方式進行驗證 - 資料夾middlewares > auth.js 的 login (01:34:08)
        * 流程講解 (01:50:29) (02:29:16)
* 功能 - 註冊使用者
    * 資料夾controllers > user.js 的 create (00:53:07)
    * postman測試 (01:04:54)
* 功能 - 登入
    * 資料夾controllers > user.js 的 create (00:53:07)
* 功能 - 上傳大頭貼
    * 驗證jwt - 資料夾passport > passport.js 的 jwt (02:38:08)
    * Postman講解 ()
    * 呼叫驗證方式進行驗證 - 資料夾middlewares > auth.js 的 jwt (02:59:56)
    * 資料夾routes > user.js (03:07:32)
    * Postman測試 (03:09:20)
    * 流程講解 (03:29:54)
    * 檔案上傳 (03:37:18)
        * 安裝套件：npm i multer cloudinary multer-storage-cloudinary
        * cloudinary (03:41:48)
        * 資料夾middlewares > upload.js (03:50:27)
            * 設定cloudinary
            * 設定上傳套件 - upload
            * function (04:02:53)
        * 資料夾routes > user.js (04:13:10)
    * 資料夾controllers > user.js 的 avatar (04:30:56)
    * Postman測試 (04:36:55)
* 功能 - 登出
    * 資料夾controllers > user.js 的 logout (04:17:14)
    * Postman測試 (04:19:41)