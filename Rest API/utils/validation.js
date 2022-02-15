//VALIDATION
const Joi = require("@hapi/joi");

//to verify that all of our information is corect, there are a few different
//things we cvan do, of course, we can check using a bunch of if statements,
//to make sure that the inputted data is correct,

//--> But, the best thing we can do, is actually automate this process,
//we can use Joi, to create a sort of validation schema, which takes in the
//data that thet user enters, and the cross-refrences it with the schema, to make
//sure that all of the data is according to our specification

//REGISTER VALIDATION
//we pass in the request body, so we can check it
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });

  //VALIDATE THE DATA BEFORE WE MAKE A USER
  //what we do here, is validate the schema, the first parameter is the data we want
  //to check, and we cross refrence it with the schema above
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });

  //VALIDATE THE DATA BEFORE WE MAKE A USER
  //what we do here, is validate the schema, the first parameter is the data we want
  //to check, and we cross refrence it with the schema above
  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
};
