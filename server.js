const express = require("express")
const app = express();
const ErrorHandler = require("./middlewares/ErrorHandler");
const connectDb = require("./config/db");
require("dotenv").config();
const PORT = process.env.PORT || 5000
const router = require("./routes/auth.user")
app.use(express.json())
const cookieParse = require("cookie-parser")


connectDb(); //Db is connected



app.use(cookieParse()) // for cookies

app.use("/api/auth", router) // this route belongs to User
app.use("/api",router) // to get all Comments :)

// app.use(ErrorHandler)
app.listen(PORT, () => console.log(`Server is runnig at port : ${process.env.FRONTEND_URL}`))