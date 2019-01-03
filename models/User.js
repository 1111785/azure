const mongoose        = require('mongoose');
const Schema          = mongoose.Schema;
const bcrypt          = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');
const timestamps      = require('../components/timestamps');

var UserSchema   = new Schema({
    name : {
        type     : String,
        required : [true, "O `nome` é obrigatório"]
    },
    email : {
        type     : String,
        required : [true, "O `email` é obrigatório"],
        index: true,
        unique: true 
    },
    password : {
        type     : String,
        required : [true, "A `password` é obrigatória"],
        validate : {
            validator: function(v) {
                return v.length >= 8;
            },
            message : 'A password deve ter pelo menos 8 carateres'
        },
    },
    address: {
        type     : String,
        required : true,
    },
    role: {
        type     : String,
        required : true,
        enum     : ['admin', 'client', 'manager', 'producer']
    }
});

UserSchema.pre('save', function(next, done) {
    if(this.isModified('password')){
        this.password = bcrypt.hashSync(this.password, 8);
    }
    next();
});

UserSchema.methods.checkPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.plugin(uniqueValidator);
UserSchema.plugin(timestamps);

module.exports = mongoose.model('User', UserSchema);
