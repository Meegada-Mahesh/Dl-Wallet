var mongoose = require("mongoose");

var walletSchema = mongoose.Schema({
    walletid:{
        type:String
    },
    walletpassword:{
        type:String
    }
});

var userSchema = mongoose.Schema({

    name:{
        type:String
    },
    password:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    wallet:[walletSchema]
});

var user = module.exports =  mongoose.model('user',userSchema);
