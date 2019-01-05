const jwt    = require('jsonwebtoken');
const config = require('../config');
const guid   = require('guid');
const moment = require('moment');

let signToken = (user) => {
    let token = jwt.sign({ id: user._id, email: user.email, name: user.name, role: user.role, address: user.address }, config.jwt.secret, {
        expiresIn : "7 days",
        notBefore : 0,                     //now
        audience  : config.jwt.audience,
        issuer    : config.jwt.issuer,
        jwtid     : guid.raw(),
        subject   : user.email
    });

    return {
        token: token,
        expirationDate: moment().add(7, 'days')
    };
};

let verifyToken = (token, callback) => {
    jwt.verify(token, config.jwt.secret, {
        audience : config.jwt.audience,
        issuer   : config.jwt.issuer
    }, function(err, decoded) {
        callback(err, decoded);
    });
};

module.exports = {
    signToken   : signToken,
    verifyToken : verifyToken
};