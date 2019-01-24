const express = require('express');
const app = express();
const port = 3000;
app.set('view engine', 'ejs');

app.get('/', function(req,res){
    res.render('landing');
});

app.get('/campsites', function(req, res){
    var campsites = [
        {name: "Salmon Creek", image: "https://via.placeholder.com/150"}
        {name: "Granite Hill", image: "https://via.placeholder.com/150"}
        {name: "Mountain Goats Rest", image: "https://via.placeholder.com/150"}
    ]
    res.render("campsites", {campsites: campsites});
});
 app.listen(port, () => console.log(`App is listening on port ${port}!`));