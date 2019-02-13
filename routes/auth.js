const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

//ROOT ROUTE
router.get('/', function(req,res){
    res.render('landing');
});

//show register form
router.get('/register', function(req,res){
    res.render('register');
});

//handle sign up logic
router.post('/register', function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/campsites');
        })
    });
});

//show login form
router.get('/login', function(req, res){
    res.render('login');
});

//handling login logic
router.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/campsites',
        failureRedirect: '/login'
    }), function(req, res){

});

//logout route
router.get('/logout', function(req,res){
    req.logout();
    req.flash('success', 'Logged you out');
    res.redirect('/campsites');
});

//middleware
function isLoggedIn(req,res,next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;