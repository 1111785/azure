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
                        order.User = "";
                        order.save(
                            function (err) {
                                if (err)
                                    res.send(err);
                            }
                        )
                    });
                }
                var token = auth.getTokenFromRequest(req);
                var userAux = auth.getUser(token);
                var auxid = userAux.id;
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

    removeAdmin:function(req, res) {
        var token = auth.getTokenFromRequest(req);
        var userAux = auth.getUser(token);
        var auxemail = userAux.email;
        if (req.body.email != auxemail) {
            User.findOneAndRemove({  email: req.body.email },
            function (err) {
                if (err)
                    res.send(err);

                res.status(200).json({ message: "User removed with success" });
            });
        } else {
            res.status(401)
        }
    },

    getUsers:function(req, res) {
        User.find(function (err, users) {
            res.json(users);
        });
    },

    getUsersNotClient:function(req, res) {
        User.find( { role: {'$ne': "client" }}, function (err, users) {
            res.json(users);
        });
    },

    edit:function(req, res) {
        let newUser = new User();
        newUser.email = req.body.email;
        newUser.name = req.body.name;
        newUser.password = req.body.password;
        newUser.address = req.body.address;
        oldEmail = req.body.oldEmail;
        oldPassword = req.body.oldPassword;
        User.findOne({
            'email': oldEmail
        })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'invalid_user', message: 'Invalid User' });
            }

            if (!user.checkPassword(oldPassword)) {
                return res.status(401).json({ error: 'invalid_user', message: "Wrong Password" });
            }

            user.email = newUser.email;
            user.name = newUser.name;
            user.password = newUser.password;
            user.address = newUser.address;

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
        });
    },

    registerAdmin:function(req, res) {
        let user = new User();
        user.email = req.body.email;
        user.name = req.body.name;
        user.password = req.body.password;
        user.role = req.body.role;
        user.address = req.body.address;
        console.log(user);
        user.save()
        .then(function(user) {
            res.status(200).json({ message: "User registed with success" });
        }).catch(utils.handleError(req, res));
    },
};