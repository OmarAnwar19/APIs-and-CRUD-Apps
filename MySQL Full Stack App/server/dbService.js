const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

let instance = null;

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) throw err;
  console.log(`MySql ${db.state}...`);
});

//CREATING A DBSERVICE CLASS, THIS WILL ACT AS OUR CONTROL CENTRE FOR
//COMMUNICATING WITH OUR MYSQL DATABASE
//--> WE WILL HANDLE ALL REQUESTS TO OUR DATABASE INSIDE HERE
class DbService {
  //here, we create a static method to get an instance of the dbService
  //STATIC METHODS IN JS ARE ONES THAT CAN ONLY BE CALLED ON THE CLASS ITSELF
  //THEREFORE, BY CREATING A STATIC METHOD HERE, WE CREATE A METHOD THAT CAN ONLY
  //BE CALLED ON THE CLASS OBJECT, AND RETURNS A DB INSTANCE

  //IF THIS WAS NOT A STATIC METHOD, THEN EACH TIME WE USE THIS FUNCTION, WE'D CREATE
  //ANOTHER INSTANCE OF A DB SERVICE, WHEN WE ONLY NEED ONE

  //THIS PRETTY MUCH ACTS LIKE CREATING A STATIC, getDbServiceInstance FUNCTION
  //HOWEVER, THE ONLY DIFFERENCE, IS THAT IF NONE EXIST, IT CREATES A NEW ONE
  static getDbServiceInstance() {
    return instance ? instance : new DbService();
  }

  //creating our get handle, has to be async because it takes some time to get data
  //NOTE: we technically dont have to make it async, but, if we dont, it will paush
  //the program while it fetches. This might not sound like a big deal, but if we
  //were to fetch a large amount of data, this could be a substantial pause in our code
  async getAllData() {
    try {
      const res = await new Promise((resolve, reject) => {
        //standard inserting our data into a sql, and pushing it to our server
        const sql = "SELECT * FROM names;";
        db.query(sql, (err, result) => {
          if (err) throw err;
          resolve(result);
        });
      });
      return res;
    } catch (err) {
      throw err;
    }
  }

  //function to insert a name
  async insertNewName(name) {
    try {
      const dateAdded = new Date();
      const insertId = await new Promise((resolve, reject) => {
        const query = "INSERT INTO names (name, date_added) VALUES (?,?);";

        db.query(query, [name, dateAdded], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.insertId);
        });
      });
      return {
        id: insertId,
        name: name,
        dateAdded: dateAdded,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async deleteRowById(id) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "DELETE FROM names WHERE id = ?";

        db.query(query, [id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.affectedRows);
        });
      });

      return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async updateNameById(id, name) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "UPDATE names SET name = ? WHERE id = ?";

        db.query(query, [name, id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.affectedRows);
        });
      });

      return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async searchByName(name) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM names WHERE name = ?;";

        db.query(query, [name], (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });

      return response;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = DbService;
