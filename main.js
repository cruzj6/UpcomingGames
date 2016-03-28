/**
 * Created by Joey on 3/1/2016.
 */
//require('dotenv').config();
var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
var app = express();
var bodyparser = require('body-parser');
var passport = require('passport');
var SteamStrategy = require('passport-steam').Strategy;
var session = require('express-session');

//Set up body parser for post requests
app.use(bodyparser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyparser.json());

//Set up our express-session middleware
app.use(session({
    secret: 'test',
    name: 'steamSession',
    resave: true,
    saveUninitialized: true})
);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Set up our strategies, starting with steam strategy
passport.use(new SteamStrategy({
        //TODO: CHANGE TO REAL URL ON DEPLOY
        returnURL: 'https://polar-ravine-80609.herokuapp.com',
        realm: 'http://localhost:3000/',
        apiKey: process.env.STEAM_API_KEY
    },
    function(identifier, profile, done) {
        process.nextTick(function () {

            //Set the profile identifier to the full URL identifier
            profile.identifier = identifier;
            return done(null, profile);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

//Public Static Resources
app.use(express.static(path.join(__dirname, 'WebVC')));
app.use(express.static(path.join(__dirname, 'WebVC/builds')));
app.use(express.static(path.join(__dirname, 'Style')));

//Set up handlebars view engine
app.set('views',path.join(__dirname, '/WebView'));
app.engine('hbs', exphbs({defaultLayout: 'main',
    extname:'.hbs',
    layoutsDir: path.join(__dirname, '/WebView/layouts')
}));
app.set('view engine', 'hbs');

//Finally set up our routes
var extDataRouter = require('./Router/externalDataRouter');
var userDataRouter = require('./Router/userDataRouter');
app.use('/info', extDataRouter);
app.use('/userdata', userDataRouter);

//Root request hanlder
app.get('/', function(req, res){
    //If the user is signed in render the app's main template
    if(req.isAuthenticated()) {
        res.render('index',{
            userName: req.user.displayName
        });
    }
    else{
        //If the user is not signed in send them the welcome page
        res.render('welcomepage');
    }
});

app.get('/auth/steam', passport.authenticate('steam'),
    function(req, res)
    {
        //This will not be called
        res.redirect('/');
    }
);

app.get('/auth/steam/return',
    passport.authenticate('steam', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

app.get('/logout', function(req, res){
    //When the user logs out destroy the session and log them out
    req.logout();
    req.session.destroy(function(){});

    //Redirect them home
    res.redirect('/');
});

app.listen(process.env.PORT || 5000);