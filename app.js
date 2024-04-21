const express = require ('express')
const app = express()
//Using Joi for server side validation 
//We are requiring the campgroundSchema from the schmas.js file
//This is not the same as the mongo schema, dont be confused 
const {campgroundSchema} = require('./schmas.js')
//Requiring the review schema from the schmas.js file for validation
const {reviewschema} = require('./schmas.js')



//This is needed to render pages from any directory path
const path = require('path')
//Requiring the method-override package
const methodOverride = require('method-override')
//Requiring ejs-mate
const ejsMate = require('ejs-mate')
//Async error handling function is being imported
const catchAsync = require('./utils/catchAsync')
const expressError = require('./utils/expressError')
//Requiring the routes from the campgrounds.js file 
//This is because we needed to clean up the app.js
// Therefore we have moved most of the routes to a seperate file
//This is how it must be done in a production environment
const campgrounds = require('./routes/campgrounds.js')
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


app.use('/campgrounds',campgrounds)
//Bellow is all of our routes 
//We use express for this
//Rendering the home page
app.get('/',(req,res)=>{
    res.render('home')
})
//Using Joi for server side side validation when a customer leaves a review of a campground 
const validatereview = (req,res,next) => {
    const {error} = reviewschema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg,400)
      }
      //console.log(result)
      else{
        next()
      }
}

app.post('/campgrounds/:id/reviews', validatereview,catchAsync(async (req, res) => {
    //Searching in the campground model
    const campground = await Campground.findById(req.params.id); // Corrected method name
    const review = new Review(req.body.review); // Corrected property access
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));
//Deleting a review
app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    // Remove the reviewId from the reviews array of the campground
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the review
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/campgrounds/${id}`);
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


