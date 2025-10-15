const multer = require("multer");
const path = require("path");
const ErrorHandler = require("../utils/errorHandler");

const __basedir = path.resolve();

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/resources/static/assets/uploads/attach/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

//var attachFile = multer({ storage: storage, fileFilter: pdfFilter });
var attachFile = multer({ storage: storage });
module.exports = attachFile;
