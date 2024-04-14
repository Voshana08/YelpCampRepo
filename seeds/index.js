//********************* 
//This file is used to seed the data from cities.js and seedHelper.js
// ********************
const express = require ('express')
const cities = require('./cities')
//destructuring the seedhelpers two arrays
const {places,descriptors} = require('./seedHelpers')
//Connecting to mongoose
//Copied from the mongoose docs
const mongoose = require('mongoose');
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelpcampapp');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
main().catch(err => console.log(err));
const Campground = require('../models/campground');

//Checking to see if the database has connected succesfully
const db = mongoose.connection
db.on("error",console.error.bind(console,'connection error'))
db.once('open',() =>{
    console.log("Database connected")
})

const sample = (array) =>{
   return  array[Math.floor(Math.random() * array.length)]
}
//A function to seed the db 
const seedDB = async() =>{
    await Campground.deleteMany({})
    
    for (let i=0;i<50;i++){
        //Generatiung a random campground price
        let campprice = Math.floor(Math.random() *20 ) +10 
        //Generating a random int
        const random1000 = Math.floor(Math.random() * 1000)
        //Creating a new campground
        const camp = new Campground({
            //Generating campgrounds with city and state from the cities.js file
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
           image: 'https://source.unsplash.com/collection/483251',
           description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus vel veritatis, repellendus dicta cumque praesentium quam harum alias porro sit voluptas officia hic quae possimus rerum culpa omnis excepturi expedita!",
           price:campprice
        })
        await camp.save()
    }


}
seedDB().then(() => {
    mongoose.connection.close()
})
