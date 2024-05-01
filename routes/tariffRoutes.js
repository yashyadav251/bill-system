const express=require("express");
const { createtariff, updatetariff, gettariff, gettariffdetail } = require("../controller/tariffController");
const router=express.Router();
router.route("/createtariff").post(createtariff);
router.route("/updatetariff").post(updatetariff);
router.route("/gettariff").post(gettariff);
router.route("/gettariffdetail").post(gettariffdetail);
module.exports = router