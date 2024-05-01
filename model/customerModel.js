const mongoose=require("mongoose");
const validator = require("validator");
const customerSchema=new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        // maxLength: [30, "Name cannot exceed 30 characters"],
        // minLength: [3, "Name should have more than 3 characters"],
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        // unique: true,
        // default:"164sumit20@gmil.com"
        validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    accountNo: {
        type: String,
        // required: [true, "Please Enter customer accountNo"],
        unique: true,
    },
    tariffType: {
        type: String,
        // required: [true, "Please Enter customer tariffType"],
    },
    electricMeterNo: {
        type: String,
        // required: [true, "Please Enter customer electricMeterNo"],
    },
    lastConsumeedUnit:{
        type:Number,
        default:0

    },
    currentConsumeedUnit:{
        type:Number,
        default:0
    },
    totalUnitLeft:{
        type:Number,
        default:0
    },
    modificationDate: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})
module.exports=mongoose.model("Customer",customerSchema);