const User = require("../models/user.js");

//signup form
module.exports.renderSignupform = (req,res)=>{
    res.render("../views/user/signup.ejs");
}

//signup 
module.exports.signup = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        let regUser = new User({
            email:email,
            username:username,
        });
        let newUser = await User.register(regUser,password);
        // console.log(newUser);
        req.login(newUser,(err)=>{
            if(err){
                return next(err);
            } req.flash("success",`User ${username} registered`);
        res.redirect("/listing");
        });
        
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

//login form
module.exports.renderLoginForm = (req,res)=>{
    res.render("../views/user/login.ejs");
}

//login
module.exports.login = async(req,res)=>{
        req.flash("success","User LoggedIn");
        if(res.locals.originalUrl && (res.locals.originalUrl.endsWith("/reviews") || res.locals.originalUrl.endsWith("?_method=DELETE"))){
            // res.locals.originalUrl = res.locals.originalUrl.slice(0,33);
            return res.redirect("/listing");
        }
        if(res.locals.originalUrl){
            res.redirect(res.locals.originalUrl);
        }else{
            res.redirect("/listing");
        }
}

//logout
module.exports.logout = (req,res)=>{
    req.logOut((err)=>{
        if(err){
            req.flash("error",err);
            res.redirect("/listing");
        }else{
            req.flash("success","You are now loggedOut");
            res.redirect("/listing");
        }
    });
}