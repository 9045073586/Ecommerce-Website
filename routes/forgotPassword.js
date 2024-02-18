const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User');

router.get('/forgot', (req, res) => {
    try{
        res.render('resetPassword/forgot')
    }
    catch(e){
        console.log(e);
        res.render('error', {err:e.message})
    }
})

router.post('/forgot', async (req, res) => {
    try{

        let {email} = req.body;
    
        if (email === '') {
            res.status(400).send('Email required');
        }
        // console.log(email);
    
        let user = await User.findOne({ email: email })
    
        if (user === null) {
            console.error('email not in database');
            res.status(403).send('Email not in db');
        } 
        else {
            const token = crypto.randomBytes(20).toString('hex');
    
            await User.findByIdAndUpdate(user._id, {
                resetPasswordToken: token,
                resetPasswordExpires: Date.now() + 6*60*1000,
            });
    
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'ch.rahuljaat777@gmail.com',
                    pass: 'omgxnmxabfsoxqky',
                },
            });
    
            const mailOptions = {
                from: 'ch.rahuljaat777@gmail.com', // replace with your email
                to: `${user.email}`,
                subject: 'Link To Reset Password',
                text:
                    'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
                    + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
                    + `http://localhost:8080/reset/${token}\n\n`
                    + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
            };
    
            console.log('sending mail');
    
            transporter.sendMail(mailOptions, (err, response) => {
                if (err) {
                    console.error('there was an error: ', err);
                } else {
                    console.log('here is the res: ', response);
                    req.flash('success', 'Recovery email sent');
                }
            });
        }
        res.redirect('/products');
    }
    catch(e){
        console.log(e);
        res.render('error', {err:e.message})
    }
});

router.get('/reset/:token', (req, res) => {
    try{
        let { token } = req.params;
        res.render('resetPassword/reset', {token});
    }
    catch(e){
        console.log(e);
        res.render('error', {err:e.message})
    }
})

router.post('/reset/:token', async (req, res) => {
    try{
        let {password} = req.body;
        let {token} = req.params;
    
        let user = await User.findOne({
            resetPasswordToken : token,
            resetPasswordExpires : { $gt : Date.now()}
        })
    
        if(user == null){
            res.status(403).send('password reset link is invalid or has expired');
        }
        else{
            console.log(user);
    
            let {username, email, gender, role} = user;
            const userData = new User({username, email, gender, role});
    
            await User.deleteOne(user);
    
            let newUser = await User.register(userData, password);
    
            user.updateOne({
                resetPasswordToken : null,
                resetPasswordExpires : null
            })
            console.log("password updated")
        }
        res.render('auth/login');
    }
    catch(e){
        console.log(e);
        res.render('error', {err:e.message})
    }
})

module.exports = router;