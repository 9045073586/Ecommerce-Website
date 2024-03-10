const mongoose = require('mongoose');

// schema creation
const productsSchema = new mongoose.Schema({
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

    desc: {
        type: String,
        trim: true,
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    stock: {
        type: Number,
        trim: true,
        required: true
    }
})

// create model
const Products = mongoose.model('Products', productsSchema);

module.exports = Products;