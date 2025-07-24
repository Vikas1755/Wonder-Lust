const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); 
const {validateListing, listingOwner} = require("../middleware.js");
const {isLoggedIn} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

//all listings
//add listings
router.route("/")
.get(wrapAsync ( listingController.index ))
.post(upload.single('image'),validateListing,wrapAsync( listingController.addNewListing ));
// .post(upload.single('image'),(req,res)=>{
//     res.send(req.file);
// })

//new listing
router.get("/new",isLoggedIn,listingController.renderNewListing);

//individual listing
//delete listing
router.route("/:id")
.get(wrapAsync ( listingController.renderIndividualListing ))
.delete(isLoggedIn,listingOwner,wrapAsync( listingController.destroyListing ));

//edit form
//edit post
router.route("/:id/edit")
.get(isLoggedIn, wrapAsync ( listingController.renderEditListing ))
.patch(isLoggedIn,listingOwner,upload.single('image'),validateListing,wrapAsync( listingController.editListing));

module.exports = router;