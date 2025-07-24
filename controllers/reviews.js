const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

//reviews
module.exports.createNewReview = async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = await Review.insertOne({
        rating:req.body.rating,
        comment:req.body.comment,
        author:req.user._id,
        // author:res.locals.currUser,
    });

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success","Listing Review Added");

    res.redirect(`/listing/${listing._id}`);
}

//deleting reviews
module.exports.destroyReview = async (req,res)=>{
        let {id,reviewId} = req.params;

        await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
        await Review.findByIdAndDelete(reviewId);

        req.flash("success","Listing Review Deleted");

        res.redirect(`/listing/${id}`);
}