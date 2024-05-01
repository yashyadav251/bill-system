const express=require("express");
const { registercustomer, updatecustomer, getcustomerdetail, paybill, batchMail } = require("../controller/customerController");
const router=express.Router();
router.route("/registercustomer").post(registercustomer);
router.route("/updatecustomer").post(updatecustomer);
router.route("/getcustomerdetail").post(getcustomerdetail);
router.route("/paybill").post(paybill);
router.route("/batchmail").post(batchMail);
module.exports = router