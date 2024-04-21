const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema
//Creating the schema
const CampgroundSchema = new Schema({
    title:{
        //By default all values are set to required:false
        type:String
        
    },
    image:{
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
    },
    reviews: [{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }]
})
//Definfing a middleware
CampgroundSchema.post('findOneAndDelete', async function(doc){
   if(doc){
    await Review.deleteMany({
        _id:{
            $in:doc.reviews
        }
    })
   }
})

//creating and exporting a model with the schema mentioned above
module.exports = mongoose.model("Campground",CampgroundSchema)
