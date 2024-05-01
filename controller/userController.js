// import User from "../model/userModel"
const User=require("../model/userModel")
exports.createuser=async(req,res)=>{
    let user=req.body
    try {
        
        user= await User.create(req.body);
        res.status(201).json({
            success:true,
            user
        });
        console.log(user);
    } catch (error) {
        res.status(404).json({
            success:false,
            error
        })
    }
    console.log(user);
}
exports.loginuser=async(req,res)=>{
    try {
        const{username,password}=req.body;
        const user=await User.findOne({username}).select("+password");
        if(user.password==password){
            res.status(201).json({
                success:true,
                user
            })
            // console.log(user);
        }else{
            res.status(200).json({
                success:false,
                message:"inccorect username or password"
            })
        }
    } catch (error) {
        res.status(404).json({
            success:false,
            error
        })
    }
    // console.log(req.body);
}