const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

//signup form
//signup 
router.route("/signup")
.get(userController.renderSignupform)
.post(wrapAsync(userController.signup));

//login form
//login
router.route("/login")
.get(userController.renderLoginForm)
.post(saveUrl,passport.authenticate("local",
    {failureRedirect:"/login",failureFlash:true}),
    userController.login
);

//logout
router.get("/logout",userController.logout);

module.exports = router;