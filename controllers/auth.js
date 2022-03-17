const bcrypt = require("bcryptjs");
const {validationResult} = require("express-validator");
const dotenv = require("dotenv");
const otpGenerator = require("otp-generator");

dotenv.config();

const User = require("../models/users")
const Otp = require("../models/otp");
const mail = require("../utils/sendemail");

var emailregex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/
exports.signup = async(req, res, next) => {
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ Error: "Validation Failed" });
    }
  
    const {email} = req.body;
  
    var validemail = emailregex.test(email);
  
    if (!validemail) {
       const error = new Error('Please enter a valid email');
       error.statusCode = 422;
       throw error;
    }
  
    const user = await User.findOne({email:email});
    if(user)
    {
      const error = new Error("User already exists !!");
      error.statusCode = 400;
      throw error;
    }
  
    const otp = otpGenerator.generate(6, {
     lowerCaseAlphabets: false,
     upperCaseAlphabets: false,
     specialChars: false
    });
  
    const onetimepwd = new Otp({
     email:email,
     otp:otp
    });
    await onetimepwd.save();
    const e = mail.sendEmail(email,otp);
    return res.status(201).json({message:'Otp sent'});
  }
    catch(err){
      if (!err.statusCode) {
        err.statusCode = 500;}
        next(err);
    }
}

exports.otpVerification = async(req,res,next)=>{
  try{
    const {email,otp} = req.body
    const newotp = await Otp.findOne({email:email}).sort({createdAt : -1})
      if(!newotp)
      {
        const err = new Error('Otp is expired');
        err.statusCode = 422;
        throw err;
      }
      if (newotp.otp !== otp) 
      { 
        const err = new Error("Wrong Otp");
        err.statusCode = 420;
        throw err;
      }
        await newotp.remove();
        return res.status(200).json({message: "verified"});
    }
    catch(err){
      if (!err.statusCode) {
        err.statusCode = 500;}
        next(err);
    }
  
  }

  
exports.enterPassword = async(req, res, next) => {
  try{
    const {email,password,confirmPass} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ Error: "Validation Failed" });
    }
    if(password != confirmPass)
    {
      const error = new Error("Passwords do not match");
      error.statusCode = 422;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new User({
      email: email,
      password: hashedPassword
    });
    await user.save();
    return res.status(200).json({message:"successfully registered"});
  }
    catch(err){
      if (!err.statusCode) {
        err.statusCode = 500;}
        next(err);
    }
}
 

exports.resendotp = async (req,res,next)=>{
  try{
  const {email} = req.body;
  const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false
  });
  const onetimepwd = new Otp({
    email:email,
    otp:otp
  });
  await onetimepwd.save();
   res.status(200).json({message: "otp sent"});
  return mail.sendOtp(email,otp);
  }
  catch(err){
      if (!err.statusCode) {
          err.statusCode = 500;}
          next(err);
  }
}