const mongoose = require('mongoose');

const MszScheme = mongoose.Schema({
    ConvoID: {
        type: String, 
        required: true
    },
    SenderID:{
        type: String,
        required: true
    },
    Message:{
        type: String,
        required: true
    }

});
const DoGalla = mongoose.model('Gallan', MszScheme);
module.exports = DoGalla;