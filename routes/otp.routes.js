const express =require("express");
const {
   sendOtp,
   verifyOtp
} = require("../controllers/otp.controller");
const router =express.Router();

router.route("/newOtp").post(sendOtp);
router.route('/verifyOtp').post(verifyOtp)


module.exports =router;
