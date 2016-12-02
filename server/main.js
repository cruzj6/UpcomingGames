'use strict';

/**
 * Created by Joey on 3/1/2016.
 */
require('babel-core/register');
var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
var app = express();
var bodyparser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var dotenv = require('dotenv');
dotenv.load();
require('./auth/ucgames/ucgamesauth').authSetup(passport);

//Set up our express-session middleware
app.use(session({
        secret: 'ilikeandescandies',
        name: 'ucgamessession',
        resave: true,
        saveUninitialized: true
    })
);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Set up body parser for post requests
app.use(bodyparser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyparser.json());

//Public Static Resources
app.use(express.static(path.join(__dirname, '../client/views')));
app.use(express.static(path.join(__dirname, '../client/builds')));
app.use(express.static(path.join(__dirname, '../client/style')));
app.use(express.static(path.join(__dirname, '../client/libs')));


//Set up handlebars view engine
app.set('views', path.join(__dirname, '/webview'));
app.engine('hbs', exphbs({ defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, '/webview/layouts')
}));
app.set('view engine', 'hbs');

//Set up routes
require('./route').default(app);

//Root request hanlder
app.get('/', function (req, res) {

    console.log(JSON.stringify(req.isAuthenticated()));
    //If the user is signed in render the app's main template
    if (req.isAuthenticated()) {
        res.render('index', {
            userName: req.user.displayName
        });
    } else {
        //If the user is not signed in send them the welcome page
        res.render('welcomepage');
    }
});

app.listen(process.env.PORT || 5000);
