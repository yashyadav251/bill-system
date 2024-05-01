const express=require("express");
const { createuser, loginuser } = require("../controller/userController");

const router=express.Router();
router.route("/createuser").post(createuser);
router.route("/loginuser").post(loginuser);
module.exports = router