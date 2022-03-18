const express = require("express");
const router = express.Router();
const {body} = require("express-validator");

const passController = require("../controllers/resetPass");

router.put('/resetpass', [
    body('email').isEmail().normalizeEmail()
   ], passController.resetpass);
  
  router.put('/resetpass/verify', [
    body('email').isEmail().normalizeEmail()
   ],  passController.verify);
  
  router.put('/resetpass/verify/newpass', [
    body('email').isEmail().normalizeEmail(),
    body('newpass').trim().isLength({ min: 6 })
  ], passController.newpassword);
  
  module.exports = router;