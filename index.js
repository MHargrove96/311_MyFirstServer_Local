require("dotenv").config();
const express = require("express");
const argon2 = require("argon2");
const app = express();
const connection = require("./ultils/connection");

const port = process.env.PORT || 3000;
app.use(express.json());

app.get("/", (req, res) => {
  res.json("hello world!");
});

app.get("/users_data", (req, res) => {
  console.log("inside GET /users_data");
  const sql = "SELECT * FROM first_table";
  connection.query(sql, (err, rows) => {
    if (err) {
      console.log("Error", err);
      return res.status(500).send("there is an error");
    } else {
      res.json(rows);
    }
  });
});

app.get("/users_data/:id", (req, res) => {
  console.log("im getting a user by id");
  const { id } = req.params;
  const sql = "SELECT * from first_table WHERE id=?;";
  connection.query(sql, [id], (err, rows) => {
    if (err) {
      console.log("Error", err);
      return res.status(500).send("there is an error");
    } else {
      res.json(rows);
    }
  });
});


app.post("/newUser_data", async (req, res) => {
  console.log("im in the POST /newUser_data");
  // const lastname = req.body.LastName;
  // const firstname = req.body.FirstName;
  // const username = req.body.UserName;
  // const userpassword = req.body.UserPassword;
  
  // instead or the above use to below
  // destructuring the body to clean up the code.
  console.log(req.body);
  const { lastname, firstname, username, userpassword } = req.body;
  const sql = `
  INSERT INTO first_table(LastName, FirstName, UserName, UserPassword)
  VALUES(?, ?, ?, ?)
  `;
  
  const hash = await argon2.hash(userpassword);
  const body = [];
  body.push(lastname, firstname, username, hash);
  
  connection.query(sql, body, (err, results) => {
    if (err) {
      console.log("Error", err);
      return res.status(500).send("there is an error");
    } else {
      res.json(results);
    }
  });
});

app.put("/users_data/:id", (req, res) => {
  console.log("im in the put request");
  const { id } = req.params;
  const { lastname, firstname, username } = req.body;
  const sql = `
    UPDATE first_table 
    SET LastName = ?, FirstName = ?, UserName = ? WHERE id = ?
  `;
  const body = [lastname, firstname, username, id];
  connection.query(sql, body, (err, results) => {
    if (err) {
      console.log("Error", err);
      return res.status(500).send("there is an error");
    } else {
      res.json(results);
    }
  });
});

app.delete("/users_data/:id", (req, res) => {
  console.log("im in the delete request");
  const { id } = req.params;
  const sql = `DELETE FROM first_table WHERE id = ?`;
  connection.query(sql, [id], (err, results) => {
    if (err) {
      console.log("Error", err);
      return res.status(500).send("there is an error");
    } else {
      res.json(results);
    }
  });
})




app.listen(port, () => {
  console.log("listing on port", port);
});
