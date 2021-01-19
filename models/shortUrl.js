const mongoose = require('mongoose');
const moment = require('moment')
const current = moment().format('DD[/]MM[/]YYYY[ - ]HH[:]mm[ ]a');


function getrandom() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 6; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

//Create the schema in Database
const shortUrlSchema = new mongoose.Schema({
    fullUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true,
        default: () => getrandom()

    },
    personalUrl: {
        type: String,
        required: false
    },
    clicks: {
        type: Number,
        required: true,
        default: 0
    },
    dateCreated: {
        type: String,
        default: moment()
    },
    dateAccessed: {
        type: String,
        default: "The link hasn't been clicked yet"
    }
})




module.exports = mongoose.model('ShortUrl', shortUrlSchema)