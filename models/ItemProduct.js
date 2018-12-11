var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemProductSchema = new Schema({
    id: Number,
    productId: { 
        type: Number, 
        min: 1,
        require: true
    },
    name: String,
    price: { 
        min: 0,
        require: true,
        type: Number
    },
    childrenProducts: [{type: Schema.Types.ObjectId, ref: 'ItemProduct'}],
    width: { 
        type: Number, 
        min: 0,
        require: true
    },
    height: { 
        type: Number, 
        min: 0,
        require: true
    },
    depth: { 
        type: Number, 
        min: 0,
        require: true
    },
    materialId: { 
        type: Number, 
        min: 1,
        require: true
    },
    finishingId: { 
        type: Number, 
        min: 1,
        require: true
    }
});


module.exports = mongoose.model('ItemProduct', ItemProductSchema);