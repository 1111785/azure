var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
    id: Number,
    itemProducts: [{
        itemProduct: { type: Schema.Types.ObjectId, ref: 'ItemProduct' }, 
    }],
    client: { type: Schema.Types.ObjectId, ref: 'Client', require: true }
});


module.exports = mongoose.model('Order', OrderSchema);