const mongoose = require('mongoose')
const Schema = mongoose.Schema
//Creating the schema
const CampgroundSchema = new Schema({
    title:{
        //By default all values are set to required:false
        type:String
        
    },
    price:{
        type:Number,
    min:0
    },
    description:{
        type:String
        
    },
    location:{
        type:String
    }
})


//creating and exporting a model with the schema mentioned above
module.exports = mongoose.model("Campground",CampgroundSchema)
