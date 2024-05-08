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