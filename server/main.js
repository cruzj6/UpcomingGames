'use strict';

/**
 * Node server entry file
 */
require('babel-core/register');
let express = require('express');
let exphbs = require('express-handlebars');
let path = require('path');
let app = express();
let bodyparser = require('body-parser');
let session = require('express-session');
let passport = require('passport');
let dotenv = require('dotenv');
dotenv.load();
require('./auth/ucgames/ucgamesauth').authSetup(passport);

//Set up our express-session middleware
app.use(session({
    secret: 'ilikeandescandies',
    name: 'ucgamessession',
    resave: true,
    saveUninitialized: true
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Set up body parser for post requests
app.use(bodyparser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyparser.json());

//Public Static Resources
app.use(express.static(path.join(__dirname, '../webapp/dist')));

//Set up handlebars view engine
app.set('views', path.join(__dirname, '/webview'));
app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, '/webview/layouts')
}));
app.set('view engine', 'hbs');

//Set up routes
require('./route').default(app);

//Root request hanlder
app.get(['/', '/usertracked', '/toptracked', '/advancedsearch'], function(req, res) {
    console.log(JSON.stringify(req.isAuthenticated()));
    //If the user is signed in render the app's main template
    if (req.isAuthenticated()) {
        res.sendFile(path.join(__dirname, '../webapp/dist/index.html'));
    } else {
        //If the user is not signed in send them the welcome page
        res.render('welcomepage');
    }
});

//TODO: TEMP
app.get('/loginpage', function(req, res) {
    res.render('welcomepage');
});

//The 404 Route
app.get('*', function(req, res) {
    res.send('Not Found', 404);
});

app.listen(process.env.PORT || 5000);