const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username : {
        type: String,
        required : [true, "Please provide unique Username"],
        unique: [true, "Username Exist"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        unique : false,
    },
    email: {
        type: String,
        required : [true, "Please provide a unique email"],
        unique: true,
    },
    firstName: { type: String},
    lastName: { type: String},
    role: { type: String},
    mobile : { 
        type : Number,
        //required: [true, "Please phone number"]
    },
    address: { type: String},
    grade: { type: String},
    fonction: { type: String},
    profile: { type: String},
    dateNaiss : {type : Date}
});

module.exports = mongoose.model('user', UserSchema)