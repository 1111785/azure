var Client = require('../models/Client');


module.exports = {
    // ======= GET =========
    getClients: function(req, res) {
         Client.find(function(err, clients) {
            if(clients === null)
                res.send();

            if (err)
                res.send(err);

            res.json(clients);
        }); 
    },

    getClientById: function(req, res) {
        Client.findById(req.params.id, function(err, client) {
            if(err) {
                if (err.name === "CastError")
                    res.send(JSON.parse('{"message":"ID is invalid or wasn\'t found."}'));
                else
                    res.send(err);
            }
            
            res.json(client);
        })
    },

    // ======= POST =======
    createClient: function(req, res) {
        var client = new Client();

        client.email = req.body.email;
        client.password = req.body.password;

        client.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Client created!', clientId: client._id });
        });
    },

    // ======= PUT =======
    updateClient: function(req, res) {
        Client.findById(req.params.id, function(err, client) {
            if(err) {
                if (err.name === "CastError")
                    res.send(JSON.parse('{"message":"ID is invalid or wasn\'t found."}'));
                else
                    res.send(err);
            }

            client.email = req.body.email;
            client.password = req.body.password;

            client.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Order updated!' });
            });
        })
    },

    // ======= DELETE =======
    deleteClient: function(req, res) {
        Client.remove({
            _id: req.params.id
        }, function(err, client) {
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