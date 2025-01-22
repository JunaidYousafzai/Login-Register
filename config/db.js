
const mongoose = require("mongoose");
require("dotenv").config();

const connectDb = async () =>{
    try{
        const dbConnection = await mongoose.connect(
            `${process.env.MONGO_DB_URI}/${process.env.AUTHENTICATION_DB_NAME}`
        )
        console.log(`Db is connected to ${dbConnection.connection.host}`)
    }catch(error){
        console.log(`Error connecting to the database :${error.message}`)
        process.exit(1);

    }
}
module.exports = connectDb