const express = require("express");
const router = express.Router();
const app = express();
const session = require("client-sessions");
const userSchema = require("../models/userSchema");

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

//   function requireLogin (req, res, next) {
//     if (!req.user) {
//       res.redirect('/login');
//     } else {
//       next();
//     }
//   };


class Router{
    constructor(){
        this.router = router;
        this.session = session;
        this.getRoutes();
        //this.checksignIn();
    }

    // checksignIn(req,res,next,err){
    //     if(req.session.user){
    //         console.log("From CheckSignIn")
    //         next();
    //     }else{
    //         console.log("Session is not present so ")
    //         console.log(req.session.user)
    //         next(err)
    //     }
    // }

    getRoutes(){
        
        

        this.router.get("/profile",(req,res)=>{
            res.send({status:"1",message:"Profile page of user wallet"})
        })

        this.router.get("/create",(req,res)=>{
            res.send({status:"1",message:"create page of user wallet"})
        })

        this.router.get("/send",(req,res)=>{
            res.send({status:"1",message:"send page of user wallet"})
        })

        this.router.get('/receive',(req,res)=>{
            res.send({status:"1",message:"Receive page of user wallet"})
        })

        this.router.get('/logout',function(req,res){
            req.session.destroy(function(){
                console.log("Session Destroyed");
            })

            res.send({status:"1",message:"Redirect to login page"})
        })

        this.router.get('/walletlist',(req,res,next)=>{
            console.log(req.query);
            userSchema.find({email:req.query.email},(error,result)=>{
                if(error){
                    console.log("Error in database data retrival");
                    res.send({status:"0",message:"Error in retrival in data from database"})
                }else{
                    console.log("Acconts are ",result);
                    res.send({status:"1",message:"Success in retrival in data from database and display cards in dashboard",data:result})
                }
            })
        })
    }
}

module.exports = new Router().router;