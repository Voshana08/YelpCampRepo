//Setting up joi as a middleware

const joi = require('joi')
 //Server side validation with joi 
module.exports.campgroundSchema = joi.object({
    campground:joi.object({
        title:joi.string().required(),
        price:joi.number().required().min(0),
        image:joi.string().required(),
        location:joi.string().required(),
        description:joi.string().required()
        
    }).required()
})

//This is how joi works. A simple example by GPT
/*const Joi = require('joi');

// Define a schema for a user object
const userSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    age: Joi.number().integer().min(18).max(100),
});

// Validate user data against the schema
const userData = {
    username: 'john_doe',
    email: 'john@example.com',
    age: 25,
};

const validationResult = userSchema.validate(userData);

if (validationResult.error) {
    console.error('Validation Error:', validationResult.error.details);
} else {
    console.log('Data is valid:', validationResult.value);
}
*/