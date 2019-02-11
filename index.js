const express    = require('express'),
      bodyParser = require('body-parser'),
      mongoose   = require('mongoose'),
      Campsite   = require('./models/campsite'),
      app        = express(),
      seedDB     = require('./seeds'),
      Comment    = require('./models/comment'),
      passport   = require('passport'),
      methodOverride = require('method-override'),
      LocalStrategy = require('passport-local'),
      User       = require('./models/user')

//requiring routes
const commentRoutes  = require('./routes/comments'),
      campsiteRoutes = require('./routes/campsites'),
      authRoutes     = require('./routes/auth')

const port = 3000;
mongoose.connect('mongodb://localhost/campsites', { useNewUrlParser: true });
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));

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

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use(authRoutes);
app.use('/campsites', campsiteRoutes);
app.use('/campsites/:id/comments', commentRoutes);

// seedDB();
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


 app.listen(port, () => console.log(`App is listening on port ${port}!`));