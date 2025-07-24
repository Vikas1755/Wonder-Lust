const mongoose = require("mongoose");

const Listing = require("./models/listing.js");

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderLust');
}

main().then((res)=>{
    console.log("CONNECTION TO DB WAS SUCCESSFUL");
}).catch((err)=>{
    console.log(err);
});

async function clear(){
    let listing = await Listing.findById("67ee9ebe07fcfadee189b6a8");
    if(!listing){
        console.log("no entry found");
    }else{
        console.log(listing);
        listing.reviews = [];
        await listing.save();
        console.log("cleared list");
    }
}

clear();