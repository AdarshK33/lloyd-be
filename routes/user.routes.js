const express =require("express");
const {

 registration1User,
 registration2User,
  addUUID
} = require("../controllers/user.controller");
const router =express.Router();
const { authorizeRoles } = require("../middlewares/auth");

const uploadInvoice = require("../middlewares/uploadInvoice");

router.route("/new").post(addUUID);

router.route("/registration1/:userId").post(registration1User);

  // uploadInvoice.fields([
  //   { name: "uploadInvoice1", maxCount: 1 },
  //   { name: "uploadInvoice2", maxCount: 1 },
  // ]),
  // uploadInvoice.single("file")
router.route("/registration2/:userId").post( uploadInvoice.fields([
    { name: "uploadInvoice1", maxCount: 1 },
    { name: "uploadInvoice2", maxCount: 1 },
  ]),registration2User);


module.exports =router;
