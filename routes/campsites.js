const express = require('express');
const router = express.Router();
const Campsite = require('../models/campsite');

//SHOW
router.get('/', function(req, res){
    Campsite.find({}, function(err, allCampsites){
        if (err) {
            console.log(err);
        } else {
            res.render("campsites/campsites", {campsites: allCampsites});            
        }
    })

});

//NEW
router.get('/new', function(req,res){
    res.render('campsites/new');
});

//SHOW
router.get('/:id', function(req, res){
    Campsite.findById(req.params.id).populate('comments').exec(function(err, foundCampsite){
        if (err) {
            console.log(err);
        } else {
            res.render('campsites/show', {campsite: foundCampsite}); 
        }
    });

});

//CREATE
router.post("/", function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampsite = {name: name, image: image, description:description};
    //Create a new campsite and save to database
    Campsite.create(newCampsite, function(err, newlyCreated){
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campsites");            
        }
    })
});

module.exports = router;