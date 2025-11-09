const Joi = require('joi')



export const registerSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).required().messages({
    'string.empty': 'Full name is required',
    'string.min': 'Full name must be at least 3 characters',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be valid',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'string-empty': 'Password is required'
  }),
});


export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string-empty': 'Email is required',
        'string-email': 'Email must be valid'
    }),
     password: Joi.string().min(6).required().messages({
    'string-min': 'Password must be at least 6 characters',
    'string-empty': 'Password is required'
  }),
})
