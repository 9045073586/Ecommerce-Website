const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport')

router.get('/register', (req, res) => {
  try{
    res.render('auth/signup');
  }
  catch(e){
    console.log(e);
    res.render('error', {err:e.message})
  }
})

router.post('/register', async (req, res) => {
  try{
    let {username, email, gender, role, password} = req.body;
    let user = new User({username, email, gender, role});
    let newUser = await User.register(user, password);
    res.render('auth/login');
  }
  catch(e){
    console.log(e);
    res.render('error', {err:e.message})
  }
})

router.get('/login', (req, res) => {
  try{
    res.render('auth/login');
  }
  catch(e){
    console.log(e);
    res.render('error', {err:e.message})
  }
})

router.post('/login',
  passport.authenticate('local',
    { 
        failureRedirect: '/login', 
        failureMessage: true 
    }),
  function(req, res) {
    req.flash('success', `Welcome Back ${req.user.username}`)
    res.redirect('/products');
  }
);

router.get('/logout', function(req, res, next){
  try{
    req.logout(() => {
        req.flash('success', 'Logged out successfully')
        res.redirect('/login');
    }
    );
  }
  catch(e){
    console.log(e);
    res.render('error', {err:e.message})
  }
});

module.exports = router;