var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClientSchema = new Schema({
    id: Number,
    email: { 
        type: String, 
        require: true
    },
    password: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('Client', ClientSchema);