const express = require('express');
const router = express.Router({mergeParams: true});
const Campsite = require('../models/campsite');
const Comment = require('../models/comment');

//Comments New
router.get('/new', isLoggedIn, function(req,res){
    Campsite.findById(req.params.id, function(err, campsite){
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {campsite:campsite});
        }
    });

});
//Comments Create
router.post('/', isLoggedIn, function(req, res){
    Campsite.findById(req.params.id , function(err, campsite){
        if (err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err) {
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campsite.comments.push(comment);
                    campsite.save();
                    res.redirect(`/campsites/${campsite._id}`);
                }
            });
        }
    });
});

//EDIT
router.get('/:comment_id/edit', function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if (err) {
            res.redirect('back');
        } else {
            res.render('comments/edit', {campsite_id: req.params.id, comment: foundComment});           
        }
    });
});

//UPDATE 
router.put('/:comment_id', function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err) {
            res.redirect('back');
        } else {
            res.redirect(`/campsites/${req.params.id}`);
        }
    })
});


//DESTROY
router.delete('/:comment_id', function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err) {
            res.redirect('back');
        } else {
            res.redirect(`/campsites/${req.params.id}`);
        }
    })
});

//MIDDLEWARE
function isLoggedIn(req,res,next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}


module.exports = router;