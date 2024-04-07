const express = require ('express')
const app = express()
//This is needed to render pages from any directory path
const path = require('path')

//Connecting to mongoose
//Copied from the mongoose docs
const mongoose = require('mongoose')
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
main().catch(err => console.log(err));
//Checking to see if the database has connected succesfully
const db = mongoose.connection
db.on("error",console.error.bind(console,'connection error'))
db.once('open',() =>{
    console.log("Database connected")
})

//Importing the campground model from the campround.js file
const Campground = require('./models/campground')


////These two lines of code are needed in order to run the ejs 
//We need to specify the engine 
//We can just copy paste these two lines of code to any project
app.set('view engine', 'ejs')
//From any directory we can render because of this line of code
app.set('/views',path.join(__dirname,'views'))



//Rendering the home page
app.get('/',(req,res)=>{
    res.render('home')
})


//Making a new campground
app.get("/makecampground", async (req, res) => {
    try {
        const camp = new Campground({ title: 'Clayton', description: "Monash University" , price:15,location:"Australia"});
        await camp.save();
        res.send(camp);
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while creating the campground.");
    }
});

//creating a server on port 3000
app.listen(3000,() =>{
    console.log("Serving on port 3000")
})


