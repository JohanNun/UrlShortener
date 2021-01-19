const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();

mongoose.connect('mongodb://localhost/urlShortenerDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));


app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls });
})


app.post('/shortUrls', async (req, res) => {
    try {
        await ShortUrl.create({ fullUrl: req.body.fullUrl })
        res.redirect('/');
    } catch (error) {
        console.log("The Url is incorrect");
    }

})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ shortUrl: req.params.shortUrl })

    if (shortUrl === null) {
        return res.sendStatus(404)
    } else {
        shortUrl.clicks++;
        shortUrl.save()


    }
    res.redirect(shortUrl.fullUrl)
})

app.listen(process.env.PORT || 5000)