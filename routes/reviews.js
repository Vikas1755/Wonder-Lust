const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js"); 
const {reviewValidation, isLoggedIn} = require("../middleware.js");
const {reviewOwner} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//reviews
router.post("/",isLoggedIn,reviewValidation,wrapAsync( reviewController.createNewReview ));

//deleting reviews
router.delete("/:reviewId",isLoggedIn,reviewOwner,wrapAsync( reviewController.destroyReview ));

module.exports = router;