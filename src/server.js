const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
//const mysql = require("mysql");
const mongoose = require("mongoose");
const session = require("express-session");
const join = require("path").join;
const path = require("path");
const jwt = require("express-jwt");
const cookieParser = require("cookie-parser");

const users = require("./router/users");
const userApi = require("./router/userApi");
const authApi = require("./router/authApi"); 
const cors = require("cors");

const connection = mongoose.connect("mongodb://localhost/poc1");


const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))

app.use(cors());
app.options('*', cors());

app.set('view engine','ejs');
app.set('views',__dirname+"/views");

app.use('/',userApi);

app.use('/',users);

app.use('/',authApi);

app.use(cookieParser())

app.use(express.static(path.join(__dirname,'public')));

class Server{
    constructor(){
        this.app = app;
        this.users = users;
        this.userApi = userApi;
        this.authApi = authApi;
        this.port = process.env.PORT || 8585;
        //this.middlewares();
        //this.config();
        this.server();
        this.routes();
        
    }

    server(){
        this.app.listen(this.port,(err)=>{
            if(err){
                console.log("Error occured while connecting to PORT",this.port);
            }else{
                console.log("Connected to the server at port ",this.port);
            }
        })
    }
  // token(){

    // }

    routes(){
        this.app.get('/',(req,res)=>{
            res.send({status:"success",message:"Default page or landing page"})
        })

        this.app.get('/register',(req,res)=>{
            res.send({status:"success",message:"Register page "})
        })

        this.app.get("/login",(req,res)=>{
            res.send({status:"success",message:"Login page"})
        })

        this.app.get('/password',(req,res)=>{
            res.send({status:"success",message:"Password page"})
        })
    }

}

new Server();
