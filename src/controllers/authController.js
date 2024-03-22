const UserModel = require('../models/userModel');
const bcrypr = require('bcryptjs');
const asyncHandle = require('express-async-handler');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: "duccu1403@gmail.com",
        pass: "qmhr ayzh heph lnuk"
    }
})

const handleSendMail = async (data) => {
    try {
        await transporter.sendMail(data);
        return 'Done'
    } catch (error) {
        return error
    }
}

const register = asyncHandle(async (req, res) => {
    const { fullname, email, password, phone } = (req.body);
    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
        res.status(401).json({ message: 'Email đã được đăng ký' });
        throw new Error(`User has already exist!!!`)
    }
    const salt = await bcrypr.genSalt(10);
    const hashedPassword = await bcrypr.hash(password, salt);
    const newUser = new UserModel({
        fullname,
        email,
        password: hashedPassword,
        phone
    });
    await newUser.save();
    res.status(200).json({ message: 'success', "data": newUser });


});
const login = asyncHandle(async (req, res) => {
    const { email, password } = (req.body);
    const existingEmail = await UserModel.findOne({ email });

    if (!existingEmail) {
        res.status(401).json({ message: 'Tài khoản chưa được đăng ký' });
        throw new Error("Email not found");
    }

    const isMatchPassword = await bcrypr.compare(password, existingEmail.password);
    if (!isMatchPassword) {
        res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không đúng' });
        throw new Error("Email or Password is not correct!");
    }
    res.status(200).json({
        message: "success",
        "data": {
            fullname: existingEmail.fullname,
            email: existingEmail.email,
            address: "",
            password: existingEmail.password,
            phone: existingEmail.phone,
            id: existingEmail.id
        }
    })
})
const forgotPassword = asyncHandle(async (req, res) => {
    const { email } = (req.body);
    const randomPassword = Math.round(100000 + Math.random() * 900000);
    const user = await UserModel.findOne({ email });
    const data = {
        from: `Mật Khẩu Mới <lynaxhai624@gmail.com>`,
        to: email,
        subject: "Verification email code",
        text: "Your code to verificayion email",
        html: `<h1>${randomPassword}</h1>`
    }
    if (user) {
        const salt = await bcrypr.genSalt(10);
        const handlePassword = await bcrypr.hash(`${randomPassword}`, salt);
        await UserModel.findByIdAndUpdate(user._id, {
            password: handlePassword,
            isChangePassword: true
        }).then(() => {

        }).catch((error) => { console.log(error) })
        await handleSendMail(data).then(() => {
            res.status(200).json({
                message: 'Đã gửi mật khẩu mới vào Email của bạn!!!',
                data: []
            })
        }).catch((error) => {
            res.status(401).json({ message: 'Không thể gửi mật khẩu mới' })
            throw new Error('Không thể gửi mật khẩu');
        })
    } else {
        res.status(401).json({ message: 'Không tìm thấy Email của bạn' });
        throw new Error('Không tìm thấy tài khoản!');
    }
})

module.exports = {
    register, login, forgotPassword
}