var Order = require('../models/Order');
const utils = require('../components/utils');
const authService = require('../services/auth.service');
var Request = require("request");
const User = require('../models/User');

module.exports = {
    // ======= GET =========
    getOrders: function(req, res) {
         Order.find(function(err, orders) {
            if(orders === null)
                res.send();

            if (err)
                res.send(err);

            res.json(orders);
        }); 
    },

    getOrderById: function(req, res) {
        Order.findById(req.params.id, function(err, order) {
            if(err) {
                if (err.name === "CastError")
                    res.send(JSON.parse('{"message":"ID is invalid or wasn\'t found."}'));
                else
                    res.send(err);
            }
            
            res.json(order);
        })
    },

    // ======= POST =======
    createOrder: function(req, res) {
        var order = new Order();

        order.itemProducts = req.body.itemProducts;
        order.user = req.body.user;
        order.producer = "fabBraga";
        order.status = "submited"

        order.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Order created!', orderID: order._id });
        });
    },

    // ======= PUT =======
    updateOrder: function(req, res) {
        Order.findById(req.params.id, function(err, order) {
            if(err) {
                if (err.name === "CastError")
                    res.send(JSON.parse('{"message":"ID is invalid or wasn\'t found."}'));
                else
                    res.send(err);
            }

            order.itemProducts = req.body.itemProducts;
            order.user = req.body.user; 

            order.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Order updated!' });
            });
        })
    },

    // ======= DELETE =======
    deleteOrder: function(req, res) {
        Order.remove({
            _id: req.params.id
        }, function(err, order) {
            if(err) {
                if (err.name === "CastError")
                    res.send(JSON.parse('{"message":"ID is invalid or wasn\'t found."}'));
                else
                    res.send(err);
            }

            res.json({ message: 'Successfully deleted' });
        });
    },

    getProducerOrders: function(req, res) {
        Order.find(producer = req.params.id, function(err, orders) {
           if(orders === null)
               res.send();

           if (err)
               res.send(err);

           res.json(orders);
       }); 
   },

   getProducerOrdersReady: function(req, res) {
        Order.find({producer: req.params.id, status: 'ready'}, function(err, orders) {
            if(orders === null)
                res.send();

            if (err)
                res.send(err);
            
            let promise = alterAllOrderUser(orders);
            promise.then(function(all) {
                console.log(all);
                res.json(all);
            });
        }); 
    },

   nextStatus: function(req, res) {
        Order.findById( req.body.id, function(err, order) {
            if(err) {
                res.status(401).send(JSON.parse('{"message":"ID is invalid or wasn\'t found."}'));
            }

            let status = order.status;

            if (status == "submited") {
                order.status = "validated";
            } else if (status == "validated") {
                order.status = "assigned";
            } else if (status == "assigned") {
                order.status = "producing";
            } else if (status == "producing") {
                order.status = "ready";
            } else if (status == "ready") {
                order.status = "on going";
            } else if (status == "on going") {
                order.status = "delivered";
            } else if (status == "delivered") {
                order.status = "received";
            } else {
                res.status(401);
            }

            order.save()
            .then(function(order) {
                res.status(200).json({ message: "Order updated with success" });
            }).catch(utils.handleError(req, res));
        })
   },

   calcPath: function(req, res) {
        let cities = [req.params.id];
        req.body.cities.forEach(element => {
            cities.push(element);
        });

        let teste = '"cidades": [';
        let aux = cities.length;
        cities.forEach(element => {
            aux--;
            teste+= "'" + element + "'";
            if (aux != 0) {
                teste+= ",";
            }
        });
        teste+= ",'lisboa']";
        cities.push("lisboa");
        console.log(cities);

        request.post({
            headers: {'content-type' : 'application/json'},
            url:     'http://localhost:5000/caminho',
            body:    {cidades: cities}
        }, function(error, response, body){
            console.log(error);
            console.log(response);
            console.log(body);
            if (error) {
                res.status(400).json(error);
            }

            res.status(200).json(body);
        });
   },

   deliverOrders: function(req, res) {
       for (let i = 0; i < req.body.orders.length; i++) {
            Order.findById( req.body.orders[i].id, function(err, order) {
                if(err) {
                    res.status(401).send(JSON.parse('{"message":"ID is invalid or wasn\'t found."}'));
                }
                order.status = "delivered";
                order.save()
                .then(function(order) {
                    res.status(200).json({ message: "Order updated with success" });
                }).catch(utils.handleError(req, res));
            });
       }
   }
}

let alterAllOrderUser = (orders) => {
    return new Promise(function(resolve, reject) {
        let auxNum = orders.length;
        console.log(auxNum);
        let ordersFinal = [];
        orders.forEach(element => {
            let promise = alterOrderUser(element);
            promise.then(function(order) {
                if (!order) {
                    reject();
                }
                ordersFinal.push(order);
                auxNum--;
                if (auxNum == 0) {
                    resolve(ordersFinal);
                }
            })
        });
    });
}

let alterOrderUser = (element) => {
    return new Promise(function(resolve, reject) {
        User.findOne( {'_id': element.user}).then(user => {
            if (!user) {
                reject();
            }
            let order = {
                id: element._id,
                producer: element.producer,
                status: element.status,
                itemProducts: element.itemProducts,
                user: user.address
            };
            resolve(order);
        });
    });
}