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
router.get('/new', isLoggedIn, function(req,res){
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
router.post("/", isLoggedIn, function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampsite = {name: name, image: image, description:description, author: author};
    //Create a new campsite and save to database
    Campsite.create(newCampsite, function(err, newlyCreated){
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campsites");            
        }
    })
});

//EDIT
router.get('/:id/edit', checkCampsiteOwnership,  function(req,res){
        Campsite.findById(req.params.id, function(err, foundCampsite){
            res.render('campsites/edit', {campsite: foundCampsite});    
    });
});

//UPDATE
router.put('/:id', checkCampsiteOwnership, function(req, res){
    //find and update correct campsite
    Campsite.findByIdAndUpdate(req.params.id, req.body.campsite, function(err, updatedCampsite){
        if (err) {
            res.redirect('/campsites');
        } else {
            res.redirect(`/campsites/${req.params.id}`);
        }
    });
});

//DESTROY
router.delete('/:id', checkCampsiteOwnership, function(req,res){
    Campsite.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            res.redirect('/campsites');
        }
        else {
            res.redirect('/campsites');
        }
    });
});

//middleware
function isLoggedIn(req,res,next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function checkCampsiteOwnership(req, res, next){
    if(req.isAuthenticated()){
        Campsite.findById(req.params.id, function(err, foundCampsite){
            if (err) {
                res.redirect('back');
            } else {
                if (foundCampsite.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect('back');
                }
            }
        });
    } else {
        res.redirect('back');
    }

}

module.exports = router;