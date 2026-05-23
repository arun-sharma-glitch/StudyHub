const mongoose = require('mongoose');


// Define the User schema
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true
    },
    bio: {
        type:String,
        default:""
    },
    university:{
        type:String,
        default:""
    }
}, 
{
        timestamps: true
    }
);

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;