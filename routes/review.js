const express = require('express');
const router = express.Router();
const Products = require('../models/Products');
const Review = require('../models/Review');
const { validateReviews, isLoggedIn } = require('../middleware');
const User = require('../models/User');

// add review
router.post('/products/:id/review',isLoggedIn, validateReviews, async (req, res) => {
    try{
        let { id } = req.params;
        let { rating, comment } = req. body;
        let userId = req.user._id;
    
        let product = await Products.findById(id);
        let user = await User.findById(req.user._id);

        let review = new Review({ rating, comment });

        // add review reference in product schema
        product.reviews.push(review);
        
        // add review reference in user schema
        user.reviews.push(review);

        await review.save();
        await product.save();
        await user.save();

        req.flash('success', 'review added successfully');
        res.redirect(`/products/${id}`);
    }
    catch(e){
        console.log(e);
        res.render('error', {err:e.message})
    }
})

// delete review
router.post('/products/:reviewId/review/delete', isLoggedIn, async (req, res) => {
    try{
        let { reviewId } = req.params;
        let {productId} = req.body;
    
        let user = await User.findById(req.user._id);
    
        if(user.reviews.includes(reviewId)){
    
            // delete review reference from product schema
            await Products.findByIdAndUpdate(productId, {$pull: {reviews: reviewId}})
    
            // delete review reference from user schema
            await User.findByIdAndUpdate(req.user._id, {$pull: {reviews: reviewId}});
            
            await Review.findByIdAndDelete(reviewId);
        }
    
        let foundProduct = await Products.findById(productId).populate('reviews');
    
        res.render('products/show', {foundProduct , user, msg: req.flash('msg')});
    }
    catch(e){
        console.log(e);
        res.render('error', {err:e.message})
    }
})

module.exports = router;