const User = require("../models/auth.user")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
require("dotenv").config()
const nodemailer = require("nodemailer");
const comments = require("../models/comment.user");

const date = new Date() // current Date

const register = async (request, response) => {
    try {

        const { username, email, password } = request.body;
        if (!username || !email || !password) {
            return response.status(400).json({
                message: `Every field must be filled to registered! `
            })
        }
        const alreadyExits = await User.findOne({ email })
        if (alreadyExits) {
            return response.status(409).json({
                message: `User already Registerd, Try to login!`
            })
        }
        const salt = await bcrypt.genSalt(15)
        const heashedPassword = await bcrypt.hash(password, salt)

        const registerUser = User.create({
            username,
            email,
            password: heashedPassword
        })
        const token = jwt.sign({ email }, process.env.EMAIL_VERIFICATION_SECRET, { expiresIn: "1h" })

        // Sending Verification Email
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.Email_USER,
                pass: process.env.EMAIL_PASS
            }
        })
        const verificationUrl = `${process.env.FRONTEND_URL}/api/auth/verify-email?token=${token}`
        await transporter.sendMail({
            from: process.env.Email_USER,
            to: email,
            subject: "Verify Your Email",
            html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
         <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #dddddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color:#28a745; color: #ffffff; text-align: center; padding: 20px;">
        <h1 style="margin: 0; font-size: 24px;">Verify Your Email</h1>
        </div>
        <div style="padding: 20px;">
        <p style="font-size: 16px; color: #333333; line-height: 1.6;">
          Hi there,
        </p>
        <p style="font-size: 16px; color: #333333; line-height: 1.6;">
          Thank you for signing up in Zentex ! Please verify your email address by clicking the button below:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #28a745; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 5px; font-size: 16px;">
            Verify Your Email
          </a>
        </div>
        <p style="font-size: 14px; color: #777777; line-height: 1.6;">
          If you did not create this account, please ignore this email.
        </p>
      </div>
      <div style="text-align: center; padding: 15px; background: #f9f9f9; font-size: 12px; color: #aaaaaa;">
        © ${date.getFullYear()} Zentex Solution. All rights reserved.
      </div>
     </div>
    </div>
`
        })
        response.status(201).json({
            message: `Email Verification Sent`
        })
    } catch (error) {
        response.status(500).json({
            message: error.message || `Error while registering User!`
        })
    }
}
const verifyEmail = async (request, response) => {
    try {
        const { token } = request.query;
        if (!token) {
            return response.status(400).json({
                message: `Token is required!`
            })
        }
        // decoding the token
        const decode = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET);
        const user = await User.findOneAndUpdate(
            { email: decode.email },
            { isVarified: true },
            { new: true }
        )

        if (!user) {
            return response.status(400).json({
                message: `Invalid or expired Token!`
            })
        }
        response.status(200).json({
            message: `Email verified successfully!`
        })
    } catch (error) {
        response.status(200).json({
            message: `Invalid or expired Token!`
        })
    }
}
const login = async (request, response) => {
    try {
        const { email, password } = request.body;
        const findUser = await User.findOne({ email })
        if (!findUser) {
            return response.status(400).json({
                message: `User not found`
            })
        }
        if (!findUser.isVarified) {
            return response.status(403).json({
                message: `Please verify your email`
            })
        }
        const isPassMatch = await bcrypt.compare(password, findUser.password)
        if (!isPassMatch) {
            return response.status(401).json({
                message: "invalid credentials."
            })
        }
        const token = jwt.sign({ userID: findUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
        response.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 24 * 60 * 1000,
        })
        console.log("Cookies:", request.cookies);
        response.status(200).json({ token })
    } catch (error) {
        response.status(500).json({
            message: error.message || `Error Logining In`
        })
    }
}
const postComment = async (request, response) => {
    try {
        const { comment } = request.body;
        if (!comment) {
            response.status(400).json({
                message: `Comment shouldn't be empty!`
            })
        }
        const postedComment = comments.create({
            comment:comment //Comment Posted by User
        })
        response.status(200).json({
            message: `comment posted successfully!`
        })
    } catch (error) {
        response.status(500).json({
            message: `Error posting comments`
        })
    }
}
const getComments = async (request, response) => {
    try {
        const allComments = await comments.find().populate("userId") // to get all comments
        if (allComments.length === 0) {
            response.status(404).json({
                message: `no Comments found!`
            })
        }
        response.status(200).json({
            allComments
        })
    } catch (error) {
        response.status(500).json({
            message: `Error while getting comments!`
        })
    }

}
module.exports = {
    register,
    verifyEmail,
    login,
    postComment,
    getComments
}