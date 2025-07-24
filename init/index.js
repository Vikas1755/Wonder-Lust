const mongoose = require("mongoose");
const allData = require("./data2.js");
const Listing = require("../models/listing.js");

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderLust');
}

main().then((res)=>{
    console.log("CONNECTION TO DB WAS SUCCESSFUL");
}).catch((err)=>{
    console.log(err);
});

async function initDb(){
    await Listing.deleteMany({});
    for(i=0;i<allData.data.length;i++){
        allData.data[i].owner = "684b35f5df21f43114702b88";
    }
    await Listing.insertMany(allData.data);
    console.log("data was added");
}

initDb();