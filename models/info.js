const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        maxLength:20,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    is_verified:{
        type:Number,
        default:0
       // required:true
    }

});

const User=mongoose.model("User",userSchema);

module.exports=User;