const Review = require('../models/review')
const Campground = require('../models/campground');
const User = require('../models/user')
const short = module.exports
short.renderRegister = (req, res) => {
    res.render('users/register')
}
//Registering a new User
short.register = async (req, res,next) => {
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
}
//Rednering login form
short.renderLogin = (req, res) => {
    res.render('users/login')
}
//login
short.login = (req, res) => {
    req.flash('success', 'Welcome Back')
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returunTo
    res.redirect(redirectUrl)
}
//logout
short.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}