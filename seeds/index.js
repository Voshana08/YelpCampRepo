const express = require ('express')

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

const seedDB = async() =>{
    await Campground.deleteMany({})
    const c = new Campground({title:'Purple field'})
    await c.save()
}
seedDB()