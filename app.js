const express = require ('express')
const app = express()
//This is needed to render pages from any directory path
const path = require('path')
//Requiring the method-override package
const methodOverride = require('method-override')

//The express.static() middleware in Express.js is used 
//to serve static files such as HTML, CSS, images, and JavaScript files from a directory. 
app.use(express.static(path.join(__dirname,'public')))
//Requiring ejs-mate
const ejsMate = require('ejs-mate')
//Requiring express sessions
const session = require('express-session')
//Flash, this is used for flashing messages
const flash = require('connect-flash')
//Requiring passport for auth
const passport = require('passport')
//localstratergy
const localStratergy = require('passport-local')
const User = require('./models/user') 
//Async error handling function is being imported
const catchAsync = require('./utils/catchAsync')
const expressError = require('./utils/expressError')
//Requiring the routes from the campgrounds.js and the reviews.js file
//This is because we needed to clean up the app.js
// Therefore we have moved most of the routes to a seperate file
//This is how it must be done in a production environment
const userRoutes = require('./routes/users.js')
const campgroundsRoutes = require('./routes/campgrounds.js')
const reviewsRoutes = require ('./routes/reviews.js')
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

const { url } = require('inspector');
const { AsyncLocalStorage } = require('async_hooks')
const { error } = require('console')
const req = require('express/lib/request.js')

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


//Sessions 
//This is for storing user sessions 
//We are configuring session data which should be saved
const sessionconfig = {
    secret : 'thisshouldbeasecret',
    resave:false,
    saveUninitialized :true,
    cookie:{
        expires : Date.now() + 1000 *60 * 60 *24 *7 ,
        maxAge : 1000 *60 * 60 *24 *7
    }
     
}
app.use(session(sessionconfig))
app.use(flash())



//Passort is for auth 
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStratergy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//middleware for flash
//This is not a full middleware for flash 
//This gives us global variables. Such as currentUser.
app.use((req,res,next)=>{
    // In summary, this code ensures that if 
    // a user tries to access a page other than the login page (/login) or the homepage (/),
    // their original URL is stored in the session. 
    // After the user successfully logs in, they will be redirected back to the page they originally requested. 
    // This helps maintain the user's navigation context across the login process.
   if(!['/login','/'].includes(res.originalUrl)){
    req.session.returnTo = req.originalUrl
   }
    res.locals.currentUser = req.user
    // console.log( res.locals.currentUser)
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

// app.get('/fakeuser',async(req,res)=>{
//     //This creates a new user
//     const user = new User({email:'colt@gmail.com',username:'colt'})
//     //User.register() takes in 2 parameters. A user object and the password
//     //This is a function which is a part of Passport.
//    const newUser = await User.register(user,'pass')
//    res.send(newUser)
// })
app.use('/',userRoutes)
app.use('/campgrounds',campgroundsRoutes)
app.use('/campgrounds/:id/reviews',reviewsRoutes)
//Bellow is all of our routes 
//We use express for this
//Rendering the home page
app.get('/',(req,res)=>{
    res.render('home')
})

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


