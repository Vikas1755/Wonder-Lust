const mongoose = require("mongoose");
const Review = require("./reviews");
const User = require("./user");

const schema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image: {
        url:String,
        filename:String
      },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
    }
});

schema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }else{
        console.log("listing not found!");
    }
});

const Listing = new mongoose.model("Listing",schema);

module.exports = Listing;