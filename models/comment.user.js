const mongoose = require("mongoose")
const User = require("./auth.user")

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    comment: {
        type: String,
        required: [true, "comment must me added"],
        minlength: 1,
        maxlength: 500
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }

})

const comments = mongoose.model("commentModel", commentSchema);
module.exports = comments;