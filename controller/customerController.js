const Customer = require("../model/customerModel");
const Tariff=require("../model/tariffModel")
const xlsx = require("xlsx");
const fs = require("fs");
const { log } = require("console");
const sendEmail = require("../config/sendEmail");
exports.registercustomer = async (req, res) => {
    try {
        const customer = await Customer.create(req.body);
        // const customer=req.body;
        if(customer){

            res.status(201).json({
                success: true,
                customer,
            })
        }
        else{
            res.status(201).json({
                success: false,
                message:"user already exist",
            })

        }
    } catch (error) {
        res.status(400).json({

            sucess: false,
                error
        })
    }

}

exports.updatecustomer = async (req, res) => {
    const { accountNo } = req.body;
    try {

        const customer = await Customer.findOne({ accountNo });
        const newcustomer = await Customer.findByIdAndUpdate(customer.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });
        res.status(201).json({
            success: true,
            newcustomer
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            // toeifkld:"dfdfdfdf",
            error
        })
    }
    console.log(req.body);
}
exports.getcustomerdetail = async (req, res) => {
    const { accountNo } = req.body;
    try {

        const customer = await Customer.findOne({ accountNo });
        if (customer) {

            res.status(201).json({
                success: true,
                customer
            });
        }
        else {
            res.status(201).json({
                success: false,
                customer
            });

        }
    } catch (error) {
        res.status(404).json({
            success: false,
            // toeifkld:"dfdfdfdf",
            error
        })
    }
    console.log(req.body);
}



exports.batchUpdateCustomers = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        // Load the Excel file
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert Excel data to JSON
        const excelData = xlsx.utils.sheet_to_json(sheet);
        console.log(excelData);
        const firstRowKeys = Object.keys(excelData[0]);
        console.log(firstRowKeys);
        // Arrays to store results
        const updatedCustomers = [];
        const notUpdatedCustomers = [];
        for (const row of excelData) {
            // Extract electricMeterNo and currentConsumeedUnit from the row
            const electricMeterNo = row['electricMeterNo'];
            let currentConsumeedUnit = parseInt(row['currentConsumeedUnit']); // Note the extra space here
            console.log(electricMeterNo, currentConsumeedUnit);
            // Check if currentConsumeedUnit is a valid number
            if (!isNaN(currentConsumeedUnit)) {
                // Find the customer document with the corresponding electricMeterNo in the MongoDB collection
                const customer = await Customer.findOne({ electricMeterNo });

                // Update lastConsumeedUnit and currentConsumeedUnit in the MongoDB document
                if (customer) {
                    customer.totalUnitLeft += currentConsumeedUnit-customer.lastConsumeedUnit;
                    customer.lastConsumeedUnit = currentConsumeedUnit;
                    customer.modificationDate = new Date(); // Update modification date
                    await customer.save();
                    console.log("Customer with meter no. updated successfully", electricMeterNo);
                    updatedCustomers.push({ electricMeterNo, currentConsumeedUnit });
                } else {
                    console.log("Customer with meter no. not found", electricMeterNo);
                    notUpdatedCustomers.push({ electricMeterNo, currentConsumeedUnit });
                }
            } else {
                console.log("Invalid currentConsumeedUnit value for meter no.", electricMeterNo);
            }
        }


        // const updatedCustomersSheet = xlsx.utils.json_to_sheet(updatedCustomers);
        // const notUpdatedCustomersSheet = xlsx.utils.json_to_sheet(notUpdatedCustomers);

        // const updatedCustomersFilePath = "updatedCustomers.xlsx";
        // const notUpdatedCustomersFilePath = "notUpdatedCustomers.xlsx";

        // xlsx.writeFile({ SheetNames: ["Updated Customers"], Sheets: { "Updated Customers": updatedCustomersSheet } }, updatedCustomersFilePath);
        // xlsx.writeFile({ SheetNames: ["Not Updated Customers"], Sheets: { "Not Updated Customers": notUpdatedCustomersSheet } }, notUpdatedCustomersFilePath);

        res.status(200).json({
            success: true,
            message: "Customers updated successfully",
            // updatedCustomersFile: updatedCustomersFilePath,
            // notUpdatedCustomersFile: notUpdatedCustomersFilePath
            updatedCustomers,
            notUpdatedCustomers
        });
        // Remove uploaded file
        // fs.unlinkSync(req.file.path);
    } catch (error) {
        console.error("Error updating customers:", error);
        res.status(500).json({ success: false, error: "An error occurred while updating customers" });
    }
};

exports.paybill=async(req,res)=>{
    const { accountNo } = req.body;
    try {

        const customer = await Customer.findOne({ accountNo });
        if (customer) {
            customer.totalUnitLeft =0;
            await customer.save();
            res.status(201).json({
                success: true,
                customer
            });
        }
        else {
            res.status(201).json({
                success: false,
                customer
            });

        }
    } catch (error) {
        res.status(404).json({
            success: false,
            // toeifkld:"dfdfdfdf",
            error
        })
    }
    console.log(req.body);

}

const calculateBillAmount = (customer,tariffCodes) => {
    if (!customer) {
        return null; // Customer details not available
    }

    const tariffCode = tariffCodes.find(tariff => tariff.code === customer.tariffType);
    if (!tariffCode) {
        return null; // Tariff code not found for the customer
    }

    let totalUnitLeft = customer.totalUnitLeft;
    let totalBillAmount = 0;

    for (let i = 0; i < tariffCode.units.length; i++) {
        if (totalUnitLeft <= 0) {
            break;
        }
        const unitsConsumed = Math.min(tariffCode.units[i], totalUnitLeft);
        if (i === 2) {
            totalBillAmount = totalUnitLeft * tariffCode.price[i];
        }
        totalBillAmount += unitsConsumed * tariffCode.price[i];
        totalUnitLeft -= unitsConsumed;
    }

    return totalBillAmount;
};


exports.batchMail = async (req, res) => {
    try {
        const jsonData = req.body.jsonData;
        const tariffCodes = await Tariff.find({});
        // console.log(jsonData,tariffCodes);
        if (!jsonData || !Array.isArray(jsonData)) {
            return res.status(400).json({ success: false, message: "Invalid JSON data" });
        }

        // Arrays to store results
        const successfullySentMail = [];
        const notSentMail = [];

        for (const data of jsonData) {
            const {electricMeterNo} = data;
            const currentConsumeedUnit = data.currentConsumeedUnit;

            // Check if currentConsumeedUnit is a valid number
            let customer;
            try {
                customer=Customer.findOne({electricMeterNo});
                let email,accountNo;
                try {
                    // Replace with your sendEmail function
                    const customer=await Customer.findOne({electricMeterNo});
                    const amount=calculateBillAmount(customer,tariffCodes);
                    email=customer.email
                    accountNo=customer.accountNo
                    console.log(`Your electricity bill is amount: ${amount}`);
                    await sendEmail({
                        email: customer.email,
                        subject: `ElectricityBill`,
                        message: `Your electricity bill is amount: ${amount}`
                    });

                    successfullySentMail.push({electricMeterNo,email,accountNo});
                } catch (error) {
                    console.error(`Error sending email for electric meter no. ${electricMeterNo}:`, error);
                    notSentMail.push({electricMeterNo,email,accountNo});
                }
            } catch (error) {
                notSentMail.push({electricMeterNo,email,accountNo});
            }

            // if (!isNaN(currentConsumeedUnit)) {
            //     // Send email logic
            //     let email,accountNo;
            //     try {
            //         // Replace with your sendEmail function
            //         const customer=await Customer.findOne({electricMeterNo});
            //         const amount=calculateBillAmount(customer,tariffCodes);
            //         email=customer.email
            //         accountNo=customer.accountNo
            //         console.log(`Your electricity bill is amount: ${amount}`);
            //         await sendEmail({
            //             email: customer.email,
            //             subject: `ElectricityBill`,
            //             message: `Your electricity bill is amount: ${amount}`
            //         });

            //         successfullySentMail.push({electricMeterNo,email,accountNo});
            //     } catch (error) {
            //         console.error(`Error sending email for electric meter no. ${electricMeterNo}:`, error);
            //         notSentMail.push({electricMeterNo,email,accountNo});
            //     }
            // } else {
            //     console.log("Invalid currentConsumeedUnit value for meter no.", electricMeterNo);

            //     notSentMail.push({electricMeterNo,email,accountNo});
            // }
        }
        console.log(successfullySentMail,notSentMail);
        res.status(200).json({
            success: true,
            successfullySentMail,
            notSentMail
        });
    } catch (error) {
        console.error("Error sending batch emails:", error);
        res.status(500).json({ success: false, error: "An error occurred while sending batch emails" });
    }
};
 



