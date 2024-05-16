const express = require('express')
const router = express.Router();
const User = require('../models/user')
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')
const users = require('../controllers/users')
//Serving the register form
router.get('/register',users.renderRegister)
//Getting the data from the register form 
//And then registering a new user
router.post('/register', catchAsync(users.register))
//Serving the login form
router.get('/login', users.renderLogin)
//Fetching the data from the login form
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout); 

module.exports = router;

