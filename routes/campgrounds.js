const express = require('express')
const router = express.Router()
const flash = require('connect-flash')
//Async error handling function is being imported
const catchAsync = require('../utils/catchAsync')
//Using Joi for server side validation 
//We are requiring the campgroundSchema from the schmas.js file
//This is not the same as the mongo schema, dont be confused 
const {campgroundSchema} = require('../schmas.js')

//Importing the campground model(Mongo) from the campround.js file
const Campground = require('../models/campground');
//Importing the review model
const Review = require('../models/review.js')
//Importing the isLoggedIn middleware from middleware.js
const {isLoggedin} = require('../middleware.js')
const {validateCampground} = require('../middleware.js')
const {isAuthor} = require('../middleware.js')
//Making a new campground to test out the code 
//  router.get("/makecampground", async (req, res) => {
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
router.get('/',async (req,res) =>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
})

//Creating a form 
router.get('/new',isLoggedin,(req,res)=>{
    res.render('campgrounds/new')
})

//We need a post request to send the form data through
//If we need to submit a form we need to use a post route 
//Using the catchAsync function to catch async errors
router.post('/',validateCampground,isLoggedin,catchAsync(async(req,res,next) =>{
    // if(!req.body.campground) throw new expressError("Invalid campground")
   const campground = new Campground(req.body.campground)
   campground.author = req.user._id
    await campground.save()
    req.flash('success','Successfully made a campground')
    res.redirect(`/campgrounds/${campground._id}`)
    
}))

//Displaying individual campgrounds on the /campground/show page
router.get('/:id',catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id).populate('reviews').populate('author')
   // console.log(campground)
   if(!campground){
    req.flash('error','Cannot find campground')
    return res.redirect('/campgrounds')
   }
  res.render('campgrounds/show',{campground})
}))

//Editing already inserted content 
//We are going to be using a form for this 
router.get('/:id/edit',isLoggedin,isAuthor, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const {id} = req.params
    // const campground = await Campground.findById(id)
    if(!campground){
      req.flash('error','Cannot find campground')
      return res.redirect('/campgrounds')
     }
    
    res.render('campgrounds/edit', { campground });
}))

router.put('/:id',validateCampground,isLoggedin,isAuthor,catchAsync(async(req,res)=>{


  //getting the information from the request 
    const {id} = req.params
    //Finding the value with that id and then updating it 
    //We have used spread here 
     const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    req.flash('success',"Successfuly updated campground")
    //Redirecting back to the show page
    res.redirect(`/campgrounds/${campground._id}`)}))

//Deleting a Campground
router.delete('/:id',isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    
    const campground = await Campground.findById(id)
    if(! campground.author.equals(req.user._id)){
      req.flash(error,'You do not have permission')
     return res.redirect(`/campgrounds/${id}`)
      
    }
    await Campground.findByIdAndDelete(id);
    req.flash('success',"Successfuly deleted campground")
    res.redirect('/campgrounds');
}));

module.exports= router;
