const express = require("express");
const router = express.Router();
const {body} = require("express-validator");

const authController = require("../controllers/auth");

router.post("/signup", authController.otp);

router.post("/otpVerification", [
  body("email").normalizeEmail().isEmail()
  .withMessage('please enter a valid email'),
  body("password").trim().isLength({ min: 6 })
], authController.otpVerification);

router.post("/login",[body("email").normalizeEmail()], authController.login);

router.post("/generateaccesstoken", authController.generateAccessToken);

router.post("/logout", authController.logout);

module.exports=router; 