const mysql = require("mysql");
const express = require("express");
const router = express.Router();

//Imports from other files
const dbService = require("../dbService");

//Main
router.get("/", (req, res) => {
  console.log("home");
});

//CREATE
router.post("/insert", (req, res) => {
  const { name } = req.body;
  const db = dbService.getDbServiceInstance();
  const result = db.insertNewName(name);

  result
    //res.json returns our data as a json string
    .then((data) => res.json({ data: data }))
    .catch((err) => console.log(err));
});

//READ
router.get("/getAll", (req, res) => {
  const db = dbService.getDbServiceInstance();
  const result = db.getAllData();

  result
    //res.json returns our data as a json string
    .then((data) => res.json({ data: data }))
    .catch((err) => console.log(err));
});

// UPDATE
router.patch("/update", (request, response) => {
  const { id, name } = request.body;
  const db = dbService.getDbServiceInstance();

  const result = db.updateNameById(id, name);

  result
    .then((data) => response.json({ success: data }))
    .catch((err) => console.log(err));
});

//DELETE
router.delete("/delete/:id", (request, response) => {
  const { id } = request.params;
  const db = dbService.getDbServiceInstance();

  const result = db.deleteRowById(id);

  result
    .then((data) => response.json({ success: data }))
    .catch((err) => console.log(err));
});

router.get("/search/:name", (request, response) => {
  const { name } = request.params;
  const db = dbService.getDbServiceInstance();

  const result = db.searchByName(name);

  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

module.exports = router;
