const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const otpGenerator = require('otp-generator');
require('dotenv/config');

const User = require("../models/users");
const Store = require("../models/stores");
const Otp = require("../models/otp");
const mail = require("../utils/sendemail");
const Token = require("../models/token");

var emailregex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/

exports.resetpass = async (req, res, next) => {
    if (!validationResult(req).isEmpty())
        return res.status(422).json('please enter a valid email');

    try {
        const email = req.body.email;
        var validemail = emailregex.test(email);

        if (!validemail) {
            const error = new Error('Please enter a valid email');
            error.statusCode = 422;
            throw error;
        }

        const user = await User.findOne({ email: email });
        if (user === null)
            return res.status(401).send('User not found');

        const otp = otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        });

        const result = await Otp.findOne({ email: email });
        if (result === null) {
            const newOtp = new Otp({ email: email, otp: otp });
            await newOtp.save();
        }
        else
            await Otp.updateOne({ email: email }, { $set: { otp: hashed_otp } });

        mail.sendEmail(email, otp);
        return res.status(200).send('otp sent successfully');
    } catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        next(err);
    }
};

exports.verify = async (req, res) => {
    if (!validationResult(req).isEmpty())
        return res.status(422).json('please enter a valid email');
    try{
        const email = req.body.email;
        var validemail = emailregex.test(email);

        if (!validemail) {
            const error = new Error('Please enter a valid email');
            error.statusCode = 422;
            throw error;
        }

        const otp = req.body.otp;
    
        const optInDb = await Otp.findOne({ email: email });
        if (!optInDb) {
            const err = new Error('Otp is expired');
            err.statusCode = 422;
            throw err;
          }
          if (optInDb.otp !== otp) {
            const err = new Error("Wrong Otp");
            err.statusCode = 420;
            throw err;
          }
        else {
            await User.updateOne({ email: email }, { $set: { passVerify: true } });
            return res.status(200).json('correct otp');
        }
    } catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        next(err);
    }
};

exports.newpassword = async (req, res, next) => {
    if (!validationResult(req).isEmpty())
        return res.status(422).json('validation failed');

    try{
        const {newpass,email} = req.body;

        const user = await User.findOne({ email: email });
        if (user === null){
            const error = new Error("User is not registered !!");
            error.statusCode = 400;
            throw error;
          }

        const otp = await Otp.findOne({ email: email });
        if (otp === null) {
            await User.updateOne({ email: email }, { $set: { passVerify: false } });
            const error = new Error("session expired try again");
            error.statusCode = 400;
            throw error;
        }

        if (user.passVerify) {
            const hashedPw = await bcrypt.hash(newpass, 12);
            await User.updateOne({ email: email }, { $set: { password: hashedPw, passVerify: false } });
            return res.status(200).json('password updated');
        }

        const error = new Error("user not verified please enter otp");
        error.statusCode = 400;
        throw error;
    } catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        next(err);
    }
};