const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    
    img: {
        type: String,
        trim: true,
        required: true,
    },

    price: {
        type: Number,
        trim: true,
        required: true,
    },

    quantity: {
        type: Number,
        default: 1
    },
    product:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products'
        }
    
})

// create model
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;