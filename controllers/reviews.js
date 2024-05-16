const Review = require('../models/review')
const Campground = require('../models/campground');

const short = module.exports

short.createReview = async (req, res) => {
    //Searching in the campground model
    const campground = await Campground.findById(req.params.id); // Corrected method name
    const review = new Review(req.body.review); // Corrected property access
    review.author = req.user._id
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    req.flash('success','Created new review')
    res.redirect(`/campgrounds/${campground._id}`);
}

short.deleteReviews = async (req, res) => {
    const { id, reviewId } = req.params;

    // Remove the reviewId from the reviews array of the campground
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the review
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted review')
    res.redirect(`/campgrounds/${id}`);
}
