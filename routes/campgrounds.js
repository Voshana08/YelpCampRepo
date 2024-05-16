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
//This is requiring the controller function
const campgrounds =require('../controllers/campgrounds.js')
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
router.get('/',catchAsync(campgrounds.index))

//Creating a form 
router.get('/new',isLoggedin,campgrounds.renderNewForm)

//We need a post request to send the form data through
//If we need to submit a form we need to use a post route 
//Using the catchAsync function to catch async errors
router.post('/',validateCampground,isLoggedin,catchAsync(campgrounds.createCampground))

//Displaying individual campgrounds on the /campground/show page
router.get('/:id',catchAsync(campgrounds.showCampground))

//Editing already inserted content 
//We are going to be using a form for this 
router.get('/:id/edit',isLoggedin,isAuthor, catchAsync(campgrounds.renderEditForm))

router.put('/:id',validateCampground,isLoggedin,isAuthor,catchAsync(campgrounds.updateCampground))

//Deleting a Campground
router.delete('/:id',isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports= router;
