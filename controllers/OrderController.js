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
    }
}