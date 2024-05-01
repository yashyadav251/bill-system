const mongoose = require("mongoose");

const url="mongodb+srv://sumit1234:m0xgYzhhOyHhiOCT@atlascluster.wke8xpi.mongodb.net/Dataklsdldlskdkl"
const connectDatabase = async function () {
    await mongoose.connect(process.env.DB_URI).then((data) => {
        console.log(`Mongodb connected with server : ${data.connection.host}`);

    })

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


module.exports = connectDatabase;