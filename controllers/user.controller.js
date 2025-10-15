const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
let Validator = require("validatorjs");
const User = require("../models/user.model");
const path = require("path");
const bcrypt = require("bcryptjs");
const sendToken = require("../utils/jwtToken");
const UserToken = require("../models/user_token.model");
const { v4: uuidv4 } = require('uuid');
const { sendResponse } = require("../utils/sendResponse");

//ADD u ID
exports.addUUID=catchAsyncErrors(async(req,res,next)=>{

  function uuidTo9Digit() {
  // Generate UUID
  const uuid = uuidv4();

  // Convert UUID string to numeric hash
  const num = parseInt(uuid.replace(/\D/g, "").slice(0, 12), 10);

  // Ensure it's exactly 9 digits (mod trick)
  return (num % 900000000) + 100000000;
}

// Usage
  const userKey = uuidTo9Digit();
   const newId= {
    userId: uuidv4(),
    userKey:userKey
  };


      const userCreate = await User.createId(newId);
       if (!userCreate) {
    return next(new ErrorHandler(`Invalid user id`, 400));
  }
    // res.status(201).json({
    //   success: true,
    //   message: "UserID added successfully!",
    //   userKey: newId?.userId,
    // });

     sendResponse(res, 200, {
    success: true,
    message: "UserID added successfully!",
    userKey: newId.userKey,
    dataKey: newId.userId,

  });

})

//  the User
exports.registration1User = catchAsyncErrors(async (req, res, next) => {
  const userId = req.params.userId;

  const user_data = await User.getUserbyId(userId);

  if (!user_data) {
    return next(new ErrorHandler(`Invalid user id`, 400));
  }

    const user = {
      name: req.body.name,
      phone: req.body.phone,
      voucherCode:   req.body.voucherCode,
       state: req.body.state,
       district:   req.body.district,
       userId: userId,
       agreedToTerms:req.body.agreedToTerms
    }

    console.log(user)

  const result= await User.updateRegistration1( user);

   if (result.affectedRows === 0) {
    return res.status(404).json({
      success: false,
      message: "User not found or no changes made.",
    });
  }


   sendResponse(res, 200, {
   status: true,
    message: "User registration step 1 successfully!",

  });
});

exports.registration2User = catchAsyncErrors(async (req, res, next) => {
  const userId = req.params.userId;
console.log( req.files," req.files")
  const user_data = await User.getUserbyId(userId);

  if (!user_data) {
    return next(new ErrorHandler(`Invalid user id`, 400));
  }

  if (!req.files || !req.files) {
      return next(new ErrorHandler(`add uploadInvoice1`, 400));
  }
const [file1] = req.files.uploadInvoice1;
// const [file2] = req.files.uploadInvoice2;
 const invoice1Path = "/resources/static/assets/uploads/invoices/" + file1.filename;
  // const invoice2Path = req.files.uploadInvoice2
  //   ? "/resources/static/assets/uploads/invoices/" + file2.filename
  //   : null;


    console.log( req,"  req.body.outletName")
const user = {
    outletName: req.body.outletName,
    invoiceNumber: req.body.invoiceNumber,
    uploadInvoice1: invoice1Path,
    uploadInvoice2:"",
    userId: userId,
  };
console.log(user,"upload")
  const result= await User.updateRegistration2( user);

   if (result.affectedRows === 0) {
    return res.status(404).json({
      success: false,
      message: "User not found or no changes made.",
    });
  }

     sendResponse(res, 200, {
     status: true,
    message: "User registration2 successfully!",
  });

  
});



// Delete the client related projects and tasks
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  await UserToken.deleteToken(req.user.user_id, req.user.token_id);

  res.status(200).json({
    status: true,
    message: "Logout successfull",
  });
});
