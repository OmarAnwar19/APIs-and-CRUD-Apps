const router = require("express").Router();
const verify = require("./verifytoken");

router.get("/", verify, (req, res) => {
  res.json({
    posts: {
      title: "Lorem Ipsum",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vulputate arcu nec est congue, sit amet egestas neque malesuada.",
    },
  });
  //now, since we have used verify to check the logged in user using our JWT,
  //we can access the user from anywhere in the file, as long as our user is logged in
});

module.exports = router;
