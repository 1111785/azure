var mongoose = require('mongoose');

var db;

module.exports = {

    startDB: function() {
        mongoose.connect('mongodb://admin:pass123@ds247101.mlab.com:47101/darksi', { useMongoClient: true });
        db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function () {
            console.log("we're connected!");
        });
        mongoose.Promise = global.Promise;
    },
    getDB: function() {
        return db;
    }
}