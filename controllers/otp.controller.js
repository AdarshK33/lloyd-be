const otpModel = require("../models/otp.model");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
let Validator = require("validatorjs");
const bcrypt = require('bcryptjs');
const { sendResponse } = require("../utils/sendResponse");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");





exports.sendOtp = catchAsyncErrors (async(req,res,next)=>{
  const { userId } = req.body;
  if (! userId) {
       return next(new ErrorHandler(` userId is required`, 400));
  }
  const plainOtp  = Math.floor(100000 + Math.random() * 900000).toString();

const hashedOtp = await bcrypt.hash(plainOtp, 10);

    await otpModel.saveOtp(userId, hashedOtp);
var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });


   sendResponse(res, 200, {
      success: true,
    message: "OTP sent successfully",
     data: plainOtp  
    });
});

exports.verifyOtp = catchAsyncErrors (async(req,res,next)=>{
  const { userId } = req.body;

  if (!userId || !req.body.otp  ) {
      return next(new ErrorHandler(`userId and OTP required`, 400));
  }

    const hasedOtp = await otpModel.getOtpById(userId);
  const [{ otp }] = hasedOtp;

    // if (!hasedOtp) {
    //     return next(new ErrorHandler(`Invalid OTP`, 400));
    // }
    
   const isValid = await bcrypt.compare(req.body.otp, otp);

    if (!isValid) {
    return next(new ErrorHandler(`Invalid OTP`, 400));
    }
  // findValidOtp
    const record = await otpModel.findValidOtp(userId, otp);
    if (!record) {
        return next(new ErrorHandler(`Please create new otp`, 400));
    }
// 
    const expired = await otpModel.findExpireOtp(userId, otp);
        if (!expired) {
            return next(new ErrorHandler(`expired OTP`, 400));
        }

    await otpModel.markOtpUsed(record.userId);

    const token = jwt.sign(
    { userId }, 
    process.env.JWT_SECRET, // keep this in .env
    { expiresIn: "1h" } // token validity
  );
  

   sendResponse(res, 200, {
      success: true,
    message: "OTP verified successfully",
    token, // send token in response
    });

});
