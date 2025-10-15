const sql = require("./db.js");

const Otp = function (otp) {
  this.userId = otp.userId;
};

Otp.saveOtp = ( userId , otp) => {

    // console.log(otp,"oooooo" ,userId)
  return new Promise((resolve, reject) => {
    sql.query(
      "INSERT INTO otps (userId, otp, expires_at) VALUES (?, ?,NOW() + INTERVAL 5 MINUTE )",
      [userId , otp],
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
};

Otp.findValidOtp = (userId , otp) => {
  return new Promise((resolve, reject) => {
    sql.query(
` SELECT * FROM otps 
   WHERE userId = ? 
     AND otp = ? 
     AND used = 0 
     AND expires_at > NOW() 
   ORDER BY id DESC 
   LIMIT 1
      `,
      [userId, otp],
      (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      }
    );
  });
};

Otp.findExpireOtp = (userId , otp) => {

  console.log(userId,otp,"hello otp")
  return new Promise((resolve, reject) => {
    sql.query(
` SELECT * FROM otps 
   WHERE userId = ? 
     AND otp = ? 
     AND used = 0
   ORDER BY id DESC 
   LIMIT 1
      `,
      [userId, otp],
      (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      }
    );
  });
};

Otp.markOtpUsed = (id) => {
  return new Promise((resolve, reject) => {
    sql.query(
      "UPDATE otps SET used = TRUE WHERE userId = ?",
      [id],
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
};


Otp.getOtpById = (id) => {
  return new Promise((resolve, reject) => {
    sql.query(
      "SELECT * FROM otps WHERE userId = ? ORDER BY id DESC LIMIT 1",
      [id],
      (err, results) => {
        if (err) return reject(err);
        if (!results || results.length === 0) {
          return reject(err);
        }
          resolve(results);
      }
    );
  });
};


module.exports = Otp;
