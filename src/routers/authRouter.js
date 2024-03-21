const { Router } = require("express");
const { register, login, forgotPassword } = require("../controllers/authController");


const authRouter = Router();
authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/forgotpassword',forgotPassword)

module.exports=authRouter;