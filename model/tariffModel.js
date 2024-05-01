const mongoose=require("mongoose");
const tariffSchema=new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: [true, "please enter product name"]
    },
    units: {
        type: [Number],
        required: true 
    },
    price: {
        type: [Number], 
        required: true 
    },
    
    createdAt:{
        type:Date,
        default:Date.now

    },
})
module.exports=mongoose.model("Tariff",tariffSchema);
