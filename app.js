const express=require("express");
const bodyParser = require("body-parser");
const app=express();
const tariff=require("./routes/tariffRoutes")
// const customer=require("./routes/customerRoutes")
const customer=require("./routes/customerRoutes")
const user=require("./routes/userRoutes")
const batch=require("./routes/batchUpdateRoute")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const cors=require("cors")
app.use(cors({
    origin: "*"
}))
app.use("/api/v1",tariff);
app.use("/api/v1",customer);
app.use("/api/v1",user);
app.use("/api/v1",batch);
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "config/config.env" });
}
app.post("/demo",(req,res)=>{
    res.json({
        name:"BigInt",
        price:45,
        
    })
})
module.exports=app;
