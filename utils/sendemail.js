const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport(sendGridTransport({
  auth:{
    api_key: process.env.API_KEY
  }
}))

exports.sendEmail =(email,otp)=>{
  transporter.sendMail({
    to:email,
    from:'learnatstuista@gmail.com',
    subject:'Verification OTP',
    html:`<h4>Hello user,</h4>
    <br>Please use this One time password to verify your account.<br>
    OTP:${otp}<br>
    Do not share it with anyone.<br>
    <h5>Thanks ,<br>Team Q-Wait?</h5>`
  })
}