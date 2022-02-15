const jwt = require("jsonwebtoken");

//basically, what this does, is that it is a middlware function, to check
//wehther or not a user has a jwt token, which will enable them to access private routes
module.exports = function (req, res, next) {
  //first, we get the token by retriving it from where we saved it in the header
  const token = req.header("auth-token");
  //if there is no token, then we return an error message
  if (!token) return res.status(401).send("Access Denied");

  //otherwise, if there is a tokoen, we have to check if it is valid or not
  try {
    //we call jwt.verify, passing in the token, and our secret,
    ///this is a method in jwt, which verifies the integrity of the token
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    //if all is good, we set the user as verified
    req.user = verified;

    //otherwise, if any errors are caught
  } catch (err) {
    //set our status as 400, and return a message that the token is inbvalid
    res.staus(400).send("Invalid Token");
  }
  next();
};

//now, in order to make a route private, all we have to do is import this file into somewhere,
//and add it as a parameter in our route
