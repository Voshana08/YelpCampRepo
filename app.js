const express = require ('express')
const app = express()
const {campgroundSchema} = require('./schmas.js')
//This is needed to render pages from any directory path
const path = require('path')
//Requiring the method-override package
const methodOverride = require('method-override')
//Requiring ejs-mate
const ejsMate = require('ejs-mate')
//Async error handling function is being imported
const catchAsync = require('./utils/catchAsync')
const expressError = require('./utils/expressError')

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
//Importing the review model
const Review = require('./models/review.js')
const { url } = require('inspector');
const { AsyncLocalStorage } = require('async_hooks')
const { error } = require('console')
// const campground = require('./models/campground')


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
//Using joi
const validateCampground = (req,res,next) =>{
  const {error} = campgroundSchema.validate(req.body)
  if(error){
    const msg = error.details.map(el => el.message).join(',')
    throw new expressError(msg,400)
  }
  //console.log(result)
  else{
    next()
  }
}

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
//Using the catchAsync function to catch async errors
app.post('/campgrounds',validateCampground,catchAsync(async(req,res,next) =>{
    // if(!req.body.campground) throw new expressError("Invalid campground")
   const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
    
}))

//Displaying individual campgrounds on the /campground/show page
app.get('/campgrounds/:id',catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id)
  res.render('campgrounds/show',{campground})
}))

//Editing already inserted content 
//We are going to be using a form for this 
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}))

app.put('/campgrounds/:id',validateCampground,catchAsync(async(req,res)=>{
    //getting the infor from the request 
    const {id} = req.params
    //Finding the value with that id and then updating it 
    //We have used spread here 
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    //Redirecting back to the show page
    res.redirect(`/campgrounds/${campground._id}`)}))

//Deleting a Campground
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));
app.post('/campgrounds/:id/reviews', catchAsync(async (req, res) => {
    //Searching in the campground model
    const campground = await Campground.findById(req.params.id); // Corrected method name
    const review = new Review(req.body.review); // Corrected property access
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));


app.all("*",(req,res,next)=>{
    next(new expressError("Page not found",404))
})


//Error handling basics
//When the catchAsync function has an error it will come here 
//This is what is used to handle the error
app.use((err,req,res,next)=>{
    const {statusCode = 500} =err
    if(!err.message){
        err.message = 'Oh no something went wrong'
    }
    res.status(statusCode).render('error',{err})
})

//creating a server on port 3000
app.listen(3000,() =>{
    console.log("Serving on port 3000")
})


