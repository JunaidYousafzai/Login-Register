const express = require("express")
const router = express.Router();
const {
    register,
    login,
    verifyEmail,
    postComment,
    getComments
} = require("../controller/authController");
const verifyToken = require("../middlewares/verifyToken.user");


router.post("/register",register )
router.get("/verify-email", verifyEmail);
router.post("/login",login)
router.post("/post-comment",verifyToken,postComment)
router.get("/comments",getComments)


module.exports = router


