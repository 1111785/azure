// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var cors       = require('cors');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 8080;        // set our port



// Model Imports
var ItemProduct = require('./models/ItemProduct');
var Order = require('./models/Order');
//var Client = require('./models/Client');
var OrderController = require('./controllers/OrderController.js');
var ItemProductController = require('./controllers/ItemProductController.js');
var ApiController = require("./controllers/CallAPIController");
var UserController = require("./controllers/UserController");

// DATABASE
var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin631@ds024748.mlab.com:24748/arqsi_2018-2019_it2', {
    useMongoClient: true,
});
/*
mongoose.connect('mongodb://admin:pass123@ds247101.mlab.com:47101/darksi', { useMongoClient: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("we're connected!");
});
*/
mongoose.Promise = global.Promise;

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    console.log('New request @ ', req.originalUrl)
    next();
});

// Orders
router.route('/orders')
    .get(OrderController.getOrders)
    .post(OrderController.createOrder);

router.route('/orders/:id')
    .get(OrderController.getOrderById)
    .put(OrderController.updateOrder)
    .delete(OrderController.deleteOrder);

// Item Product
router.route('/itemProduct')
    .get(ItemProductController.getItemProducts)
    .post(ItemProductController.createItemProduct);

router.route('/itemProduct/:id')
    .get(ItemProductController.getItemProductById)
    .put(ItemProductController.updateItemProduct)
    .delete(ItemProductController.deleteItemProduct);

// Clients
router.route('/client')
    .get(UserController.getClients)
    .post(UserController.createClient)

router.route('/client/:id')
    .get(UserController.getClientById)
    .put(UserController.updateClient)
    .delete(UserController.deleteClient);

// Others
router.route('/checkRestrictions/:id')
    .get(ApiController.checkRestrictions)

// 404
router.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
router.use((err, req, res, next) => {
    res.locals.error = err;
    res.status(err.status).send(err);
});

// REGISTER OUR ROUTES
// accessed at GET http://localhost:8080/api)
app.use('/api', router);

// START THE SERVER
app.listen(port);
console.log('Magic happens on port ' + port);
module.exports = app;