const Campground = require('./models/campground');
const expressError = require('./utils/expressError')
//Using Joi for server side validation 
//We are requiring the campgroundSchema from the schmas.js file
//This is not the same as the mongo schema, dont be confused 
const {reviewschema} = require('../schmas.js')
const {campgroundSchema} = require('./schmas.js')

module.exports.isLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
    
        req.flash('error','You must be signed in')
        //redirecting to the /login url.
        //When it goes to /login, it will render the login page from the as that 
        //is what is specified

        return res.redirect('/login')
      }
      next()
}

//Using joi for server side validation of the campground 
module.exports.validateCampground = (req,res,next) =>{
  const {error} = campgroundSchema.validate(req.body)
  if(error){
    const msg = error.details.map(el => el.message).join(',')
    throw new expressError(msg,400)
  }
  //console.log(result)
  else{
    next()
  }
}
//Another middleware for checking if the author has permission
//In order to authorize to perform edit and delete functions
module.exports.isAuthor = async(req,res,next) => {
  const  {id} =req.params
  const campground = await Campground.findById(id)
  if(!campground.author.equals(req.user._id)){
    req.flash(error,'You do not have permission')
   return res.redirect(`/campgrounds/${id}`)
    
  }
  next()
}


//Using Joi for server side side validation when a customer leaves a review of a campground 
module.exports.validatereview = (req,res,next) => {
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
