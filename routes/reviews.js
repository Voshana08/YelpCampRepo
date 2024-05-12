const express = require('express')
const router = express.Router({mergeParams:true})
//Async error handling function is being imported
const catchAsync = require('../utils/catchAsync')
const expressError = require('../utils/expressError')


//Importing the campground model from the campround.js file
const Campground = require('../models/campground');
//Importing the review model
const Review = require('../models/review.js')
const {validatereview} = require('../middleware.js')



router.post('/', validatereview,catchAsync(async (req, res) => {
    //Searching in the campground model
    const campground = await Campground.findById(req.params.id); // Corrected method name
    const review = new Review(req.body.review); // Corrected property access
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    req.flash('success','Created new review')
    res.redirect(`/campgrounds/${campground._id}`);
}));


//Deleting a review
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    // Remove the reviewId from the reviews array of the campground
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the review
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted review')
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;

