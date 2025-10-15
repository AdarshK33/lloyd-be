const sql = require("./db.js");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// constructor
const User = function (user) {
  this.userId = user.userId;
  this.userKey= user.userKey;
};



User.createId = (user) => {
  console.log(user, "hello modal");
  return new Promise((resolve, reject) => {
    sql.query("INSERT INTO users SET ?", user, (err, res) => {
      console.log("hello");
      if (err) {
        reject(err);
        return;
      }
       resolve(res);

    });
  });
};


User.updateRegistration1 = (
                   userObj
) => {
     const { name, phone,  voucherCode, state, district, agreedToTerms
, userId }= userObj
  return new Promise((resolve, reject) => {
    sql.query(
      "UPDATE users SET name=?, phone=? , voucherCode=? , state=?, district=?,agreedToTerms=? WHERE userId = ?",
      [
        name,
        phone,
        voucherCode,
        state,
        district,
         agreedToTerms,
        userId,
      ],
      (err, res) => {
        if (err) {
        return  reject(err);
         
        }
        
          return resolve(res);
  
      }
    );
  });
};

User.updateRegistration2 = (
                   userObj
) => {
     const { 
    outletName,
    invoiceNumber,
    uploadInvoice1,
    // uploadInvoice2, 
    userId }= userObj
  return new Promise((resolve, reject) => {

    console.log(userObj,"hello 2")
    sql.query(
      "UPDATE users SET outletName=?,   invoiceNumber=? , uploadInvoice1=?  WHERE userId = ?",
      [
      outletName,
      invoiceNumber,
      uploadInvoice1,
      // uploadInvoice2, 
      userId
      ],
      (err, res) => {
        if (err) {
        return  reject(err);
        }
        return resolve(res);
      }
    );
  });
};

User.getUserbyId = (userId) => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT * FROM users WHERE userId=?", userId, (err, res) => {
      if (err) reject(null)
      resolve(res[0])
    })
  })
}








module.exports = User;
