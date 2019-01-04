var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
    id: Number,
    itemProducts: [{
        itemProduct: { type: Schema.Types.ObjectId, ref: 'ItemProduct' }, 
    }],
    user: { type: Schema.Types.ObjectId, ref: 'User', require: true }
});


module.exports = mongoose.model('Order', OrderSchema);