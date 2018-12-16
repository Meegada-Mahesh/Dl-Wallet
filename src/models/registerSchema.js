const mongoose = require("mongoose");

const registerSchema = mongoose.Schema({

    name:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    }
})

var register = module.exports = mongoose.model('register',registerSchema);