const Tariff=require("../model/tariffModel")
exports.createtariff=async (req,res)=>{
    // const{code,units,price}=req.body;
    try {
        
        const tariff= await Tariff.create(req.body);
        res.status(201).json({
            sucess:true,
            tariff
        });
    } catch (error) {
        res.status(404).json({
            sucess:false,
            error
        })
    }
    console.log(req.body);
}
exports.updatetariff=async (req,res)=>{
    const{code,units,price}=req.body;
    try {
        
        const tariff= await Tariff.findOne({code});
        const newtariff = await Tariff.findByIdAndUpdate(tariff.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });
        res.status(201).json({
            sucess:true,
            newtariff
        });
    } catch (error) {
        res.status(404).json({
            sucess:false,
            // toeifkld:"dfdfdfdf",
            error
        })
    }
    console.log(req.body);
}

exports.gettariff=async(req,res)=>{
    try {
        const tariff=await Tariff.find({});
        res.status(200).json({
            sucess:true,
            tariff
        })
    } catch (error) {
        sucess:false,
        error
    }
}
exports.gettariffdetail=async(req,res)=>{
    const{code} =req.body;
    // const code=tariffCodeName
    try {
        const tariff=await Tariff.findOne({code});
        res.status(200).json({
            sucess:true,
            tariff
        })
    } catch (error) {
        sucess:false,
        error
    }
}