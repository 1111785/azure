var Order = require('../models/Order');

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
        console.log(order);

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

   nextStatus: function(req, res) {
       console.log(req.body.id);
        Order.findOneAndUpdate( _id = req.body.id, function(err, order) {
            console.log(order);
            if(err) {
                res.status(401).send(JSON.parse('{"message":"ID is invalid or wasn\'t found."}'));
            }
            console.log(order.status);
            
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
            console.log(order.status);
            order.save()
            .then(function(order) {
                res.status(200).json({ message: "Order updated with success" });
            }).catch(utils.handleError(req, res));
        })
   }
}