const express = require("express");
const router = express.Router();
// const customerController = require("../controllers/customerController");
const multer = require("multer");
const { batchUpdateCustomers } = require("../controller/customerController");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post("/batchUpdateCustomers", upload.single("file"), batchUpdateCustomers);

module.exports = router;
