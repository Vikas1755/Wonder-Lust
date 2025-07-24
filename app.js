if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const mongoose = require("mongoose");
const { title } = require("process");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); 
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");
const sessions = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const User = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.engine("ejs",ejsMate);

const dbUrl = process.env.MONGO_ATLAS_URL;

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto: {
    secret: process.env.SECRET
    },
    touchAfter:24*3600
});

store.on("error",()=>{
    console.log("ERROR IN MONGO DB ATLAS ",err);
});

const sessionsValues = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
};

app.use(sessions(sessionsValues));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listing",listingRouter);
app.use("/listing/:id/reviews",reviewRouter);
app.use("/",userRouter);

//DB connection
async function main() {
    await mongoose.connect(dbUrl);
}

main().then((res)=>{
    console.log("CONNECTION TO DB WAS SUCCESSFUL");
}).catch((err)=>{
    console.log(err);
});

app.listen(port,()=>{
    console.log("listning at port 3000");
});

//dealing with wrong pages
app.all("*",(req,res)=>{
    throw new ExpressError(404,"Page Not Found!");
});

//custom error messages
app.use((err,req,res,next)=>{
    let {statusCode = 500,message = "Something Went Wrong!"} = err;
    console.log(err.message);
    res.status(statusCode).render("error.ejs",{message});
});

