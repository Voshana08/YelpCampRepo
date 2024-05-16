const Campground = require('../models/campground');
const short = module.exports
module.exports.index = async (req,res) =>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
}

module.exports.renderNewForm = (req,res)=>{
    res.render('campgrounds/new')
}

module.exports.createCampground = async(req,res,next) =>{
    // if(!req.body.campground) throw new expressError("Invalid campground")
   const campground = new Campground(req.body.campground)
   campground.author = req.user._id
    await campground.save()
    req.flash('success','Successfully made a campground')
    res.redirect(`/campgrounds/${campground._id}`)
    
}

short.showCampground = async(req,res)=>{
    const campground = await Campground.findById(req.params.id)
    .populate({
        path: 'reviews',
        populate: { path: 'author' } // Ensure 'author' matches the field name in the review schema
    })
    .populate('author'); // Assuming the campground has an 'author' field
  
  
    console.log(campground); // Output the reviews array to the console
  
     if(!campground){
      req.flash('error','Cannot find campground')
      return res.redirect('/campgrounds')
     }
    res.render('campgrounds/show',{campground})
  }

  short.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const {id} = req.params
    // const campground = await Campground.findById(id)
    if(!campground){
      req.flash('error','Cannot find campground')
      return res.redirect('/campgrounds')
     }
    
    res.render('campgrounds/edit', { campground });
}

short.updateCampground = async(req,res)=>{


    //getting the information from the request 
      const {id} = req.params
      //Finding the value with that id and then updating it 
      //We have used spread here 
       const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
      req.flash('success',"Successfuly updated campground")
      //Redirecting back to the show page
      res.redirect(`/campgrounds/${campground._id}`)}

short.deleteCampground = async (req, res) => {
    const { id } = req.params;
    
    const campground = await Campground.findById(id)
    if(! campground.author.equals(req.user._id)){
      req.flash(error,'You do not have permission')
     return res.redirect(`/campgrounds/${id}`)
      
    }
    await Campground.findByIdAndDelete(id);
    req.flash('success',"Successfuly deleted campground")
    res.redirect('/campgrounds');
}
