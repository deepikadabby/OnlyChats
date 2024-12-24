const mongoose = require('mongoose');

const ConvoScheme = mongoose.Schema({
    members: {
        type: Array,
        required: true,
    },
});
const Baithak = mongoose.model('Baithak', ConvoScheme);
module.exports = Baithak;