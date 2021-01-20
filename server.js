const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const moment = require('moment');
const shortUrl = require('./models/shortUrl');
const current = moment().format('DD[/]MM[/]YYYY[ - ]HH[:]mm[ ]a');

const app = express();



mongoose.connect('mongodb://localhost/urlShortenerDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));



// GET all urls (long and short)
app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls });
})



// POST (submit) a URL and convert it to a shortcode
app.post('/shortUrls', async (req, res) => {
    const current = moment().format('DD[/]MM[/]YYYY[ - ]HH[:]mm[ ]a');

    try {
        await ShortUrl.create({
            fullUrl: req.body.fullUrl,
            dateCreated: current
        })
        res.redirect('/');
    } catch (error) {
        console.log("The Url is incorrect");
    }

})



// GET one URL (shortcode) and redirect to the page it refers to. Everytime the shortcode is clicked, #clicks + 1 and dateAccessed is updated and saved
app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ shortUrl: req.params.shortUrl })
    const current = moment().format('DD[/]MM[/]YYYY[ - ]HH[:]mm[ ]a');

    if (shortUrl === null) {
        return res.sendStatus(404)
    } else {
        shortUrl.clicks++
        shortUrl.dateAccessed = current;
        shortUrl.save()


    }
    res.redirect(shortUrl.fullUrl)
})



//UPDATE (Redirects to the form to edit the shortcode)
app.get('/edit/:shortUrl', async (req, res) => {

    const shortUrl = await ShortUrl.findOne({ shortUrl: req.params.shortUrl })

    res.render('editForm', { shortUrl });

})



// Update the actual field and redirects to the index page
app.post('/update', async (req, res) => {

    try {
        const short = await ShortUrl.findOneAndUpdate({ shortUrl: req.body.originalShortUrl }, { shortUrl: req.body.shortNew }, { new: true }, (error, data) => {
            if (error) {
                console.log(error);
            } else {
                console.log(data);
            }
        })
        res.redirect('/')

    } catch (error) {
        console.log("There was an error in the update");
    }

})



//Get stats of one shortcode
app.get('/stats/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ shortUrl: req.params.shortUrl })

    res.render('stats', { shortUrl });

})



app.listen(process.env.PORT || 5000)