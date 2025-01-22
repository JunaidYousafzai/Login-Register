const mongoose = require("mongoose")
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        username:{
            type:String,
            required:[true,"User name is required!"],
        },
        email:{
            type:String,
            required:[true,"Email is requied!"],
            unique:[true,"Email should be unique"]
        },
        password:{
            type:String,
            required:[true,"Password is required!"]
        },
        isVarified:{
            type:Boolean,
            default:false
        },
        googleId:{
            type:String
        }
    },
    {timeseries:true}
);

const User = mongoose.model("User",userSchema)
module.exports = User;