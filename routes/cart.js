const express = require('express');
const { isLoggedIn } = require('../middleware');
const User = require('../models/User');
const Products = require('../models/Products');
const Cart = require('../models/Cart');
const router = express.Router();
const stripe = require('stripe')('sk_test_51OiBP8SH8CIgpPAdeHybVmJqznU0MeN64XMveJi2B8I2TVgbQYWwb9DOdXy0FI40RIE1Sl9OQHc5r3yPhHXYjejj00YVQy4AtT');

// add product to cart
router.post('/user/:productId/cart', isLoggedIn, async (req, res) => {
    try{
        let { productId } = req.params;
        let  userId = req.user._id;
    
        let user = await User.findById(userId);
        let product = await Products.findById(productId);
        let {name, img, price} = product;

        // add product to cart if it is exist erlier
        if(!user.products.includes(productId)){
            // add product in cart schema
            let cartProduct = await Cart.create({name, img, price});
    
            // add product schema object-id into cart
            await Cart.findByIdAndUpdate(cartProduct._id, { $set: { product: productId } })
            
            // add cart object-id in user schema
            user.cart.push(cartProduct);
    
            // add product object-id in user schema
            user.products.push(product);
            await user.save();
        }
        else{
            req.flash('warning', 'product already in cart');
        }   
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
    
        res.render('cart/cart', {user});
    }
    catch(e){
        console.log(e);
        res.render('error', {err:e.message})
    }
})

// update quantity
router.post('/user/cart/quantity/:cartItemId', isLoggedIn, async(req, res) => {
    try{

        let quantity = req.body.quantity;
        let {cartItemId} = req.params;
        
        let cartItem = await Cart.findById(cartItemId).populate('product');
        if(cartItem.product.stock >= quantity){
            await Cart.findByIdAndUpdate(cartItemId, {quantity : quantity});
        }
        let user = await User.findById(req.user._id).populate('cart')
        res.render('cart/cart', {user});
    }
    catch(e){
        res.render('error', {err:e.message})
    }
})

// remove product from cart
router.post('/user/:cartProductId/cart/remove', isLoggedIn, async(req, res) => {
    try{
        let { cartProductId } = req.params;
        let  userId = req.user._id;
        
        let cartItem = await Cart.findById(cartProductId);

        // remove product schema id from user-schema
        await User.findByIdAndUpdate(userId, {$pull: {products: cartItem.product}});
        
        await Cart.findByIdAndDelete(cartProductId);

        // remove cartproductId from user-schema cart array
        await User.findByIdAndUpdate(userId, {$pull: {cart: cartProductId}});
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
    
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
    
            line_items: user.cart.map((cartProduct) => ({
                
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: cartProduct.name,
                        images: [cartProduct.img]
                    },
                    unit_amount: cartProduct.price * 100,
                },
                quantity: cartProduct.quantity
            })),
            mode: 'payment',
            success_url: `${YOUR_DOMAIN}/user/cart/success`,
            cancel_url: `${YOUR_DOMAIN}/error`,
          });
        
          res.redirect(303, session.url);
    }
    catch(e){
        console.log(e);
        res.render('error', {err:e.message})
    }
})

// success route after checkout
router.get('/user/cart/success', isLoggedIn, async(req, res) => {
    try{
        let user = await User.findById(req.user._id).populate('cart');
        for(let item of user.cart){

            let quantity = item.quantity;
            let product = await Products.findById(item.product._id);
            let updatedStock = product.stock - quantity;

            // update stock of products
            await Products.findByIdAndUpdate(product._id, {stock : updatedStock});

            await User.findByIdAndUpdate(user._id, {$pull: {products: product._id}})

            // delete product from cart
            await Cart.findByIdAndDelete(item._id);
        }
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