const express = require("express");
const router = express.Router();
const {body} = require("express-validator");

const authController = require("../controllers/auth");

router.post("/signup", authController.signup);

router.post("/otpVerification", authController.otpVerification);

router.post("/enterpassword",[
  body("email").normalizeEmail(),
  body("password").trim().isLength({ min: 6 })
],authController.enterPassword);

router.post("/resendotp", authController.resendotp);


module.exports=router; 