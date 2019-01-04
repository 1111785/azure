const User = require('../models/User');
const Order = require('../models/Order');
const authService = require('../services/auth.service');
const _ = require('lodash');
const utils = require('../components/utils');
const auth       = require('../public/auth.middleware');

module.exports = {
    login:function(req, res) {
        User.findOne({
            'email': req.body.email
        })
        .then(user => {
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
        user.role = "client";
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
        Order.find( { user: req.body.user.id },
        function (err, orders) {
            if (err)
                res.send(err);
            
            if (orders) {
                orders.forEach(order => {
                    order.User = null;
                    order.save(
                        function (err) {
                            if (err)
                                res.send(err);
                        }
                    )
                });
            }
            var token = auth.getTokenFromRequest(req);
            var auxid = auth.getUser(token).id;
            if (req.body.user.id == auxid) {
                User.findByIdAndRemove({  _id: req.body.user.id },
                function (err) {
                    if (err)
                        res.send(err);
    
                    res.json({ message: "User removed with success" });
                });
            } else {
                res.status(401)
            }
        });
    },

    getUsers:function(req, res) {
        User.find(function (err, users) {
            res.json(users);
        });
    },

    edit:function(req, res) {
        newUser = req.body.newUser;
        oldUser = auth.getUser(token);
        User.findOne({
            'email': oldUser.email
        }, function (err, user) {



            res.json(user);
        });
    }
};