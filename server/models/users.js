const mongoose = require('mongoose');

const usrScheme = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    token:{
        type:String
    }

});
const User = mongoose.model('User', usrScheme);
module.exports = User;