const express = require("express");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const qrcode = require("qrcode");
const app = express();
const session = require("express-session");
const jwt = require("jsonwebtoken");
const FirebaseTokenGenerator = require("firebase-token-generator");
const token = new FirebaseTokenGenerator("your-secret-is-mahesh");
const hostname = require("os").hostname;
const router = express.Router();

const key = "11c9470ab2a7cc02cd666265c9bf1a39e92418fa";
const secret = "214187441a44f5a3863b9c6098ec2ee656994b10";

const User = require('../models/userSchema');

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))

// app.use(function(req, res, next) {
//     if (req.session && req.session.result) {
//       User.findOne({ email: req.session.result.email }, function(err, user) {
//         if (user) {
//           req.user = user;
//           delete req.user.password; // delete the password from the session
//           req.session.user = user;  //refresh the session value
//           res.locals.user = user;
//         }
//         // finishing processing the middleware and run the route
//         next();
//       });
//     } else {
//       next();
//     }
//   });

  // function requireLogin (req, res, next) {
  //   if (!req.user) {
  //     res.redirect('/login');
  //   } else {
  //     next();
  //   }
  // };

//const Register = require("../models/registerSchema");

class Api{
    constructor(){
        this.router = router;
        this.postRoutes();
        //this.mail();
    }

    
    postRoutes(){
        this.router.post('/register',(req,res)=>{

            // const query1 = "select email from poc1";
            // const query2 = "insert into poc1 set?";

            const hash = bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10));
            const user = {
                name:req.body.username,
                email:req.body.email,
                password:hash
            }

            User.findOne({email:req.body.email},(error,result)=>{
                if(error){
                    res.send({status:"error",message:"Something wrong in email finding"})
                }else if(result){
                    res.send({status:"error",message:"Email already exists"})
                }else{
                    //res.send({status:"success",message:"Email doesnot exist please proceed"})
                    User.create(user,(error,result)=>{
                        if(error){
                            res.send({status:"error",message:"Error in inserting into database"})
                        }else{
                            res.send({status:"success",message:"User registered successfully Please login",data:result})
                        }
                    })
                }
            })
        })

        this.router.post('/login',(req,res,next)=>{
            //const query3 = "select email from poc1 where=?";
           // const query4 = ""
            console.log(req.body)
           User.findOne({email:req.body.email},(error,result)=>{
               if(error){
                   res.send({status:"0",message:"Error in email finding"})
               }else if(!result){
                   res.send({status:"0",message:"Email doesnot exists"})
               }else{

                console.log(result);
               // console.log(req.session.user);
                console.log(req.session);
                  // res.send({status:"success",message:""})
                  if(bcrypt.compareSync(req.body.password,result.password)){
                    req.session.user = result;
                    res.send({status:"1",message:"Login successful",data:result});
                  }else{
                      delete result["password"]
                    res.send({status:"0",message:"authentication failed"});
                  }
               }
           })
        })

        this.router.post('/resetpassword',(req,res,next)=>{
            const transporter = nodemailer.createTransport({
                host:'smtp.gmail.com',
                port:465,
                secure:true,
                auth:{
                    user:'dev.blockchain.lync@gmail.com',
                    pass:'Blockchain@123'
                },
                tls: { rejectUnauthorized: false },
                requireTLS:true
            })
            User.findOne({email:req.body.email},(error,result)=>{
                if(error){
                    res.send({status:"error",message:"Error in finding the email"})
                }
                else{

                const url = "http://localhost:4200/setpassword?id="+req.body.email;
                const mailoptions = {
                from:'dev.blockchain.lync@gmail.com',
                to:req.body.email,
                subject:'Blockchain Wallet Application',
                html:`<b>Hello All welcome to blockchain application and will increase content "${url}"</b>`
            }

            transporter.sendMail(mailoptions,(error,mailresult)=>{
                console.log(mailoptions)
                if(error){
                    console.log("Error message invoked in sendmail functionality ",error)
                    res.send({status:"error",message:"Email doesnot exist"})
                }else{
                    console.log("Mail sending Successful from backend for password reset");
                    //res.send({status:"success",message:"Mail sending successful"})
                    res.send({status:"Success",message:"Mail sent Successfully",data:mailresult});
                }
            })
                }
            })
        })
            //console.log(req.body)

        this.router.post('/setpassword',(req,res,next)=>{
            
            const hash = bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10));
            User.findOneAndUpdate({email:req.body.email}, {$set:{ password: hash }}, {new:true},(error,result)=>{
                if(error){
                    console.log("Error for setpassword");
                    res.send({status:"error",message:"Error in password updation"})
                }else{
                    res.send({status:"success",message:"password set successfully"})
                }
            })
        })

        
    }
}


module.exports = new Api().router;