const dotenv = require("dotenv");
const mysql = require("mysql");
const cors = require("cors");
const express = require("express");
const app = express();

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routes
app.use("/", require("./routes/routes.js"));

//Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
