const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");
const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.originalUrl = req.originalUrl;
        req.flash("error","User needs to be loggedIn");
        res.redirect("/login");
    }else{
        next();
    }
}

module.exports.saveUrl = (req,res,next)=>{
    if(req.session.originalUrl){
        res.locals.originalUrl = req.session.originalUrl;
    }
    next();
}

//joi listing validation
module.exports.validateListing = (req,res,next)=>{
    let result = listingSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400, result.error.details[0].message);
    }
    else{
        next();
    }
}

//joi review validation
module.exports.reviewValidation = (req,res,next)=>{
    let result = reviewSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400,result.error.details[0].message);
    }
    else{
        next();
    }
}

module.exports.listingOwner = async(req,res,next)=>{
    const {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner!");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.reviewOwner = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let listing = await Listing.findById(id);
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the Authoraised!");
        return res.redirect(`/listing/${id}`);
    }
    next();
}