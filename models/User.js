const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    // username
    // password
    email : {
        type : String,
        trim : true,
        required : true
    },
    gender:{
        type : String,
        trim : true,
        required : true
    },
    role: {
        type: String,
        default: 'buyer'
    },
    resetPasswordToken: { 
        type: String
    },
    resetPasswordExpires: { 
        type: Date 
    },
    wishlist:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products'
        }
    ],
    cart: [  
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products'
        }  
    ],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

userSchema.plugin(passportLocalMongoose);


const User = mongoose.model('User', userSchema);

module.exports = User;