const express    = require('express'),
      bodyParser = require('body-parser'),
      mongoose   = require('mongoose'),
      Campsite   = require('./models/campsite'),
      app        = express(),
      seedDB     = require('./seeds'),
      Comment    = require('./models/comment'),
      passport   = require('passport'),
      LocalStrategy = require('passport-local'),
      User       = require('./models/user')


const port = 3000;
mongoose.connect('mongodb://localhost/campsites', { useNewUrlParser: true });
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

//Passport Config
app.use(require('express-session')({
    secret: 'Oliver Burge',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//seedDB();
// Campsite.create(
//     {
//         name: "Granite Hill", 
//         image: "https://via.placeholder.com/150",
//         description: "This is a huge granite hill, no bathrooms, no water. Beautiful granite!"
//     }, function(err, campsite){
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("NEWLY CREATED CAMPSITE!");
//             console.log(campsite);
//         }
//     });

app.get('/', function(req,res){
    res.render('landing');
});

app.get('/campsites', function(req, res){
    Campsite.find({}, function(err, allCampsites){
        if (err) {
            console.log(err);
        } else {
            res.render("campsites/campsites", {campsites: allCampsites});            
        }
    })

});

app.get('/campsites/new', function(req,res){
    res.render('campsites/new');
});

app.get('/campsites/:id', function(req, res){
    Campsite.findById(req.params.id).populate('comments').exec(function(err, foundCampsite){
        if (err) {
            console.log(err);
        } else {
            res.render('campsites/show', {campsite: foundCampsite}); 
        }
    });

});

app.post("/campsites", function(req,res){
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

//===================
// COMMENT ROUTES
//===================

app.get('/campsites/:id/comments/new', function(req,res){
    Campsite.findById(req.params.id, function(err, campsite){
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {campsite:campsite});
        }
    });

});

app.post('/campsites/:id/comments', function(req, res){
    Campsite.findById(req.params.id , function(err, campsite){
        if (err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err) {
                    console.log(err);
                } else {
                    campsite.comments.push(comment);
                    campsite.save();
                    res.redirect(`/campsites/${campsite._id}`);
                }
            });
        }
    });
});

//=================
//AUTH ROUTES
//=================

app.get('/register', function(req,res){
    res.render('register');
});

app.post('/register', function(req,res){
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

 app.listen(port, () => console.log(`App is listening on port ${port}!`));