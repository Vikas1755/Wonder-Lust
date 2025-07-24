const Listing = require("../models/listing");
const {deleteImage} = require("../cloudConfig.js");

//all Listings
module.exports.index = async (req,res,next)=>{
    const listings = await Listing.find({});
    res.render("./listings/index.ejs",{listings});
}

//new Listing form
module.exports.renderNewListing = (req,res)=>{
    res.render("./listings/new.ejs");
}

//new Listing 
module.exports.addNewListing = async(req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    await Listing.insertOne({
        title:req.body.title,
        description:req.body.description,
        image:{url,filename},
        price:req.body.price,
        location:req.body.location,
        country:req.body.country,
        owner:req.user._id
    });
    req.flash("success","NEW LISTING ADDED");
    res.redirect("/listing");
}

//individual listing
module.exports.renderIndividualListing = async (req, res, next) => {
  const { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
        select: "username"
      }
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing Not Found!");
    return res.redirect("/listing");
  }

  res.render("./listings/show.ejs", {
    listing,
    googleMapsKey: process.env.MAPS_API_KEY
  });
};


//edit listing form
module.exports.renderEditListing = async (req,res,next)=>{
    const {id} = req.params;
    const listing = await Listing.findOne({_id:id});
    if(!listing){
        req.flash("error","Listing Not Found!");
        res.redirect("/listing");
    }
    let url = listing.image.url.replace("/upload","/upload/w_250");
    res.render("./listings/update.ejs",{listing,url});
}

//edit listing
module.exports.editListing = async(req,res,next)=>{
    const {id} = req.params;
    let oldData = await Listing.findById(id);
    newData = {
        title:req.body.title,
        description:req.body.description,
        price:req.body.price,
        location:req.body.location,
        country:req.body.country
    }
    if(req.file){
        newData.image = {
            url : req.file.path,
            filename : req.file.filename
        };
        await deleteImage(oldData.image.filename);    
    }
    await Listing.findOneAndUpdate({_id:id},newData);
    req.flash("success","Listing Edited");
    res.redirect(`/listing/${id}`);
}

//deleting listing
module.exports.destroyListing = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    console.log(listing.image.filename);
    await deleteImage(`${listing.image.filename}`);
    // await deleteImage(`WonderLust/${listing.image.filename}`);
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listing");
}