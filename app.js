const express = require('express')
const morgan = require('morgan')
const app = express()
const mysql = require('mysql')
const bodyParser = require('body-parser')
var path = require("path");

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/views", express.static(__dirname + "/views"));
app.use("/assets", express.static(__dirname + "/assets"));
app.use("/stylesheets", express.static(__dirname + "/stylesheets"));


var mysqlConnection = mysql.createConnection({
    host: 'fooddb.cf56gmsy3haq.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'Fooddatabase01',
    database: 'FoodDB'
})

mysqlConnection.connect((err)=>{
    if(!err){
        console.log("Connected")
    }else{
        console.log("Connected Failed")
    }
})

app.get("/", (req, res)=>{
    res.sendFile("index.html", { root: path.join(__dirname, "./views")})
})

app.get("/food", (req, res)=>{
    mysqlConnection.query('SELECT * FROM food', (err, rows, fields)=>{
        if(!err){
            res.send(rows);
            console.log(rows);
        }
        else{
            console.log(err);
        }  
    })
})

app.get("/food/:id", (req, res)=>{
    mysqlConnection.query('SELECT * FROM food WHERE FoodID = ?', [req.params.id], (err, rows, field)=>{
        if(!err){
            res.send(rows);
            console.log(rows);
        }else{
            console.log(err);
        }
    })
})

app.delete("/food/:id", (req, res)=>{
    mysqlConnection.query('DELETE FROM food WHERE FoodID = ?', [req.params.id], (err, rows, field)=>{
        if(!err){
            res.send('Deleted successfully.');
            console.log(rows);
        }else{
            console.log(err);
        }
    })
})

app.post("/addfood", (req, res)=>{
    const queryString = "INSERT INTO food (Name, Description, EstimatePrice) VALUES (?, ?, ?)";
    mysqlConnection.query(queryString, [req.body.Name, req.body.Description, req.body.EstimatePrice], (err, rows, fields)=>{
        if(!err){
            res.send('Post successfully.');
        }else{
            console.log(err);
        }
    })
})

app.patch("/update_price_food", (req, res)=> {
    const queryString = "UPDATE food SET EstimatePrice = ? WHERE Name = ?";
    if(req.body.EstimatePrice != null){
        mysqlConnection.query(queryString, [req.body.EstimatePrice, req.body.Name], (err, results) => {
            if(err) {
                console.log("Failed")
                res.sendStatus(500)
                return
            }
            res.send('Update successfully.')
        })
        
    }else{
        res.send('Failed')
    }
})

app.listen(3000, ()=> console.log('Express server is running at port 3000'))

