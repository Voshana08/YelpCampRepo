const express = require('express')
const router = express.Router();
const User = require('../models/user')
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')
//Serving the register form
router.get('/register', (req, res) => {
    res.render('users/register')

})
//Getting the data from the register form 
//And then registering a new user
router.post('/register', catchAsync(async (req, res,next) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser,err => {
            if(err){
                return next(err)
            }
            console.log(registeredUser)
        req.flash('success', 'Welcome to YelpCamp')
        res.redirect('/campgrounds')
        })
    }
    catch (e) {
        req.flash('error', e.message)
        res.redirect('/campgrounds')
    }
}))
//Serving the login form
router.get('/login', (req, res) => {
    res.render('users/login')
})
//Fetching the data from the login form
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome Back')
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returunTo
    res.redirect(redirectUrl)
})

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}); 
module.exports = router;