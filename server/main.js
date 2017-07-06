'use strict';

/**
 * Node server entry file
 */
require('babel-core/register');
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const app = express();
const bodyparser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');

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
app.get('/', (req, res) => {
    req.isAuthenticated()
			? res.redirect('/usertracked')
    	: res.render('welcomepage');
});

//Page routes handler
app.get(['/usertracked', '/toptracked', '/advancedsearch'], function(req, res) {
    console.log(JSON.stringify(req.isAuthenticated()));
    //If the user is signed in render the app's main template
    req.isAuthenticated()
    	? res.sendFile(path.join(__dirname, '../webapp/dist/main.html'))
      : res.render('welcomepage');
});

//The 404 Route
app.get('*', (req, res) => {
    res.send('Not Found', 404);
});

app.listen(process.env.PORT || 5000);
