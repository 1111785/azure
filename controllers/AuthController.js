const User = require('../models/User');
const authService = require('../services/auth.service');
const _ = require('lodash');
const utils = require('../components/utils');

module.exports = {
    login:function(req, res) {
        console.log(req.body.email);
        console.log(req.body.password);
        User.findOne({
            'email': req.body.email
        })
        .then(user => {
            console.log(user);
            if (!user) {
                return res.status(401).json({ error: 'invalid_user', message: 'O email e/ou password que introduziu não são válidos.' });
            }

            if (!user.checkPassword(req.body.password)) {
                return res.status(401).json({ error: 'invalid_user', message: "O email e/ou password que introduziu não são válidos." });
            }

            let token = authService.signToken(user);

            res.status(200).json(token);
        })
    },

    register:function(req, res) {
        let user = new User();
        user.email = req.body.email;
        user.name = req.body.name;
        user.password = req.body.password;
        user.role = req.body.role;
        user.address = req.body.address;
        user.save()
        .then(function(user) {
            // create a token
            let token = authService.signToken(user);

            let data = {
                _id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                address: user.address,
                token: token.token,
                expirationDate: token.expirationDate
            };

            res.status(200).json(data);
        }).catch(utils.handleError(req, res));
    },

    remove:function(req, res) {
        console.log("REMOVE");
        User.findByIdAndRemove({  _id: req.user._id },
        function (err, user) {
            if (err)
                res.send(err);

            res.json({ message: "User removed with success" });
        });
    }
};