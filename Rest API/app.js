const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();

//IMPORT ROUTES
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => console.log("Connected to MongoDB..."))
  .catch((err) => console.log(err));

//MIDDLEWARE
//body parser
app.use(express.json());

//route middleware
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
