const express = require('express');
const { isLoggedIn } = require('../middleware');
const User = require('../models/User');
const router = express.Router();

router.get('/user/wishlist', isLoggedIn, async (req, res) => {
    try{
        let user = await User.findById(req.user._id).populate('wishlist');
        res.render('wishlist/wishlist', {user});
    }
    catch(e){
        res.render('error', {err:e.message})}
})

module.exports = router;