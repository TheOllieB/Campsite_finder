const express    = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const port = 3000;
mongoose.connect('mongodb://localhost/campsites', { useNewUrlParser: true });
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

//Schema Setup
var campsiteSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campsite =  mongoose.model('Campsite', campsiteSchema);

Campsite.create(
    {
        name: "Salmon Creek", 
        image: "https://via.placeholder.com/150"
    }, function(err, campsite){
        if (err) {
            console.log(err);
        } else {
            console.log("NEWLY CREATED CAMPSITE!");
            console.log(campsite);
        }
    });

var campsites = [
    {name: "Salmon Creek", image: "https://via.placeholder.com/150"},
    {name: "Granite Hill", image: "https://via.placeholder.com/150"},
    {name: "Mountain Goats Rest", image: "https://via.placeholder.com/150"}
]

app.get('/', function(req,res){
    res.render('landing');
});

app.get('/campsites', function(req, res){

    res.render("campsites", {campsites: campsites});
});

app.get("/campsites/new", function(req,res){
    res.render("new");
});

app.post("/campsites", function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var newCampsite = {name: name, image: image};
    campsites.push(newCampsite);
    res.redirect("/campsites");
});

 app.listen(port, () => console.log(`App is listening on port ${port}!`));