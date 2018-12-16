const mysql = require("mysql");

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'digitallync',
    database:'poc1'
});

connection.connect((err)=>{
    if(err){
        console.log("Error in connecting database")
    }else{
        console.log("Successfully connected to database");
    }
})

module.exports = connection;