const express = require ('express')
const app = express()
//This is needed to render pages from any directory path
const path = require('path')
//Requiring the method-override package
const methodOverride = require('method-override')
//Requiring ejs-mate
const ejsMate = require('ejs-mate')
//Connecting to mongoose
//Copied from the mongoose docs
const mongoose = require('mongoose')
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelpcampapp');

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
const Campground = require('./models/campground');
const { url } = require('inspector');
const { AsyncLocalStorage } = require('async_hooks')
const campground = require('./models/campground')


////These two lines of code are needed in order to run the ejs 
//We need to specify the engine 
//We can just copy paste these two lines of code to any project
app.set('view engine', 'ejs')
//From any directory we can render because of this line of code
app.set('/views',path.join(__dirname,'views'))
//This is another package 
app.engine('ejs',ejsMate)
//Parsing the body
app.use(express.urlencoded({extended:true}))
//method-overdide package
app.use(methodOverride('_method'))
//Rendering the home page
app.get('/',(req,res)=>{
    res.render('home')
})


//Making a new campground to test out the code 
//  app.get("/makecampground", async (req, res) => {
//     try {
//         const camp = new Campground({ title: 'Clayton', description: "Monash University" , price:15,location:"Australia"});
//         await camp.save();
//         res.send(camp);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("An error occurred while creating the campground.");
//     }
//  });

//Diplaying all of the campgrounds on the /campground/index page
app.get('/campgrounds',async (req,res) =>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
})

//Creating a form 
app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new')
})

//We need a post request to send the form data through
//If we need to submit a form we need to use a post route 
app.post('/campgrounds',async(req,res) =>{
   const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
})

//Displaying individual campgrounds on the /campground/show page
app.get('/campgrounds/:id',async(req,res)=>{
    const campground = await Campground.findById(req.params.id)
  res.render('campgrounds/show',{campground})
})

//Editing already inserted content 
//We are going to be using a form for this 
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
});

app.put('/campgrounds/:id',async(req,res)=>{
    //getting the infor from the request 
    const {id} = req.params
    //Finding the value with that id and then updating it 
    //We have used spread here 
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    //Redirecting back to the show page
    res.redirect(`/campgrounds/${campground._id}`)})

//Deleting a Campground
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
});

//creating a server on port 3000
app.listen(3000,() =>{
    console.log("Serving on port 3000")
})


