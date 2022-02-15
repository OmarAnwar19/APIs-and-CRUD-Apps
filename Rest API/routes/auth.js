const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const User = require("../model/User");
const { registerValidation, loginValidation } = require("../utils/validation");

router.post("/register", async (req, res) => {
  //the reason we go {error} = validation, instaed of just setting it as a variable
  //is beacuse the validation method returns an object, not a single value, and by
  //doing {error} = validation, we are saying that we want to declare the error as the first
  //item of the validation(which takes in the req.body), therefore, the error is returned
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //before we add a new user, we first have to check if a user with the same email already exists
  //CHECK IF USER IS ALREADY IN THE DATABASE
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res.status(400).send("A user with that email already exists.");

  //before we can safely store our password in our databse, we first have to hash it so its secure
  //HASH OUR PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //CREATE A NEW USER
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save();
    res.send(`User created with id: ${savedUser._id}`);
  } catch (err) {
    res.send(400).send(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  //validating our user login
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //declaring a variable to identify the user by their email
  const user = await User.findOne({ email: req.body.email });
  //if the user's email does not exist
  if (!user)
    return res.status(400).send("A user with that email does not exist.");

  //CHECK IF PASSWORD IS CORRECT
  //compare the req.body.password (the one they just entered), with the saved hashed one
  const validPass = await bcrypt.compare(req.body.password, user.password);

  //if the password is not valid, return a message invalid password
  if (!validPass) return res.status(400).send("Invalid password.");

  //so, that's all good and well, and we've logged in, however, the only problem is that
  //although we know we're logged in, the server itself does not know that we're logged in.
  //For example, lets say this was a blog posting website, if we were to post a blog, it
  //would not say posted by us, because the browser does not know we are logged in.

  //thats where a json web token (JWT) comes into play.
  //a JWT acts as the name would suggest, as a token. Upon log in, we generate one, and each
  //time we go to preform a certain action on the website, we show that token to the function,
  //in order to be able to use it as a certain user.

  //CREATE AND ASSIGN A JSON WEB TOKEN (JWT)
  //we create a new token, using jwt.sign(what_to_tokenize(save), secret_value)
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  //then, we set our header with the (attribute ("auth-token"): value ("token"))
  res.header("auth-token", token);
  //lastly, we just output a message to the user that we have created the token
  res.send(`Logged in and created JWT: ${token}`);

  //for example, now in our front end, we could check this id, to see whos logged in.
  //we can now make multiple requrests as that user, while staying as the same user
});

module.exports = router;
