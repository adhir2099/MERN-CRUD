const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "",
    database: "",
    user: "",
    password:""

})

const ITEMS_PER_PAGE = 5;

app.get("/", (req, res) =>{
    const page = req.query.page || 1;
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const sql = `SELECT * FROM user LIMIT ${offset}, ${ITEMS_PER_PAGE}`;
    const countSql = "SELECT COUNT(*) AS total FROM user";

    db.query(sql, (err, data) => {
        if (err) return res.json("Error");
    
        db.query(countSql, (countErr, countData) => {
          if (countErr) return res.json("Error");
    
          const totalItems = countData[0].total;
          const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
          return res.json({
            data,
            totalPages,
            currentPage: page,
            totalItems,
          });
        });
    });
})

app.get("/getUser/:id", (req, res) => {
    const userId = req.params.id;
    const sql = "SELECT * FROM user WHERE id = ?";

    db.query(sql, [userId], (err, data) => {
      if (err) return res.json("Error");
      if (data.length === 0) {
        return res.json("User not found");
      }
      return res.json(data[0]);
    });
});

app.post('/create', (req, res) =>{
    const sql = "INSERT INTO user (`name`,`email`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email
    ]
    
    db.query(sql, [values], (err, data) =>{
        if(err) return res.json("Error");
        return res.json(data);
    })
})

app.put('/update/:id', (req, res) =>{
    const sql = "UPDATE user SET `name` = ?, `email` = ? WHERE id = ?";
    const values = [
        req.body.name,
        req.body.email
    ]
    const id = req.params.id;

    db.query(sql, [...values, id], (err, data) =>{
        if(err) return res.json("Error");
        return res.json(data);
    })
})

app.delete('/:id', (req, res) =>{
    const sql = "DELETE FROM user WHERE id = ?";
    const id = req.params.id;

    db.query(sql, [id], (err, data) =>{
        if(err) return res.json("Error");
        return res.json(data);
    })
})

app.listen(8099, () =>{
    console.log('listening');
})