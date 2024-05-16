const express = require('express')
const router = express.Router({mergeParams:true})
//Async error handling function is being imported
const catchAsync = require('../utils/catchAsync')
const expressError = require('../utils/expressError')
const reviews = require('../controllers/reviews.js')

//Importing the campground model from the campround.js file
const Campground = require('../models/campground');
//Importing the review model
const Review = require('../models/review.js')
const {validatereview,isLoggedin,isReviewAuthor} = require('../middleware.js')



router.post('/', validatereview,isLoggedin,catchAsync(reviews.createReview));

 
//Deleting a review
router.delete('/:reviewId',isLoggedin,isReviewAuthor,catchAsync(reviews.deleteReviews));

module.exports = router;

