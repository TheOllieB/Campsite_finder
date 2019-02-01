const mongoose = require('mongoose');

//Schema Setup
var campsiteSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports =  mongoose.model('Campsite', campsiteSchema);