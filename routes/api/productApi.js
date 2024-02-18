const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const { isLoggedIn } = require('../../middleware');

router.post('/products/:productId/like', isLoggedIn, async (req, res) => {
    try{
        let {productId} = req.params;
        let user = req.user;
    
        let isLiked = user.wishlist.includes(productId);
        if(isLiked){
            await User.findByIdAndUpdate(user._id, {$pull: {wishlist: productId}})
        }
        else{
            await User.findByIdAndUpdate(user._id, {$addToSet: {wishlist: productId}})
        }
        res.status(201).send('ok');
    }
    catch(e){
        console.log(e);
        res.render('error', {err:e.message})
    }
})

module.exports = router;