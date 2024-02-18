const express = require('express');
const { isLoggedIn } = require('../middleware');
const User = require('../models/User');
const Products = require('../models/Products');
const router = express.Router();
const stripe = require('stripe')('sk_test_51OiBP8SH8CIgpPAdeHybVmJqznU0MeN64XMveJi2B8I2TVgbQYWwb9DOdXy0FI40RIE1Sl9OQHc5r3yPhHXYjejj00YVQy4AtT');

// add product to cart
router.post('/user/:productId/cart', isLoggedIn, async (req, res) => {
    try{
        let { productId } = req.params;
        let  userId = req.user._id;
    
        let user = await User.findById(userId);
        let product = await Products.findById(productId);
    
        user.cart.push(product);
        await user.save();
    
        res.redirect('/user/cart');
    }
    catch(e){
        console.log(e);
        res.render('error', {err:e.message})
    }
})

// display cart product
router.get('/user/cart', isLoggedIn, async (req, res) => {
    try{

        let  userId = req.user._id;
        let user = await User.findById(userId).populate('cart');
    
        // let totalAmount = user.cart.price.reduce((sum, curr) => {
        //     return curr + sum;
        // }, 0);
    
        // console.log(user)
    
        res.render('cart/cart', {user});
    }
    catch(e){
        console.log(e);
        res.render('error', {err:e.message})
    }
})

// remove product from cart
router.post('/user/:productId/cart/remove', isLoggedIn, async(req, res) => {
    console.log(req.params)
    try{
        let { productId } = req.params;
        let  userId = req.user._id;
    
        let user = await User.findByIdAndUpdate(userId, {$pull: {cart: productId}});
        // console.log(user)
        res.redirect('/user/cart');
    }
    catch(e){
        console.log(e);
        res.render('error', {err:e.message})
    }
})

const YOUR_DOMAIN = 'http://localhost:8080'

// checkout the products using stripe
router.get('/user/checkout', isLoggedIn, async(req, res) => {
    try{
        let user = await User.findById(req.user._id).populate('cart');
    
        let totalAmount = user.cart.reduce((sum, curr) => {return sum + curr.price}, 0);
        let productQuantity = user.cart.length;
    
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
    
            line_items: user.cart.map((product) => ({
                
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: product.name,
                        images: [product.img]
                    },
                    unit_amount: product.price * 100,
                },
                quantity: 1 
            })),
            mode: 'payment',
            success_url: `${YOUR_DOMAIN}/user/cart/success`,
            cancel_url: `${YOUR_DOMAIN}/error`,
          });
    
        //   user.cart.length = 0;
        
          res.redirect(303, session.url);
    }
    catch(e){
        console.log(e);
        res.render('error', {err:e.message})
    }
})

router.get('/user/cart/success', isLoggedIn, async(req, res) => {
    try{
        let user = req.user;
        user.cart = [];
        await user.save();
    }
    catch(e){
        console.log(e);
        res.render('error', {err:e.message})
    }
    
    res.redirect('/user/cart')
})
module.exports = router;