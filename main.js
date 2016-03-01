var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
var app = express();
var bodyparser = require('body-parser');
var gameData = require(__dirname + '/gameDataProcessor.js');
var passport = require('passport');
var SteamStrategy = require('passport-steam').Strategy;
var session = require('express-session');

app.use(bodyparser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyparser.json());

app.use(session({
    secret: 'test',
    name: 'steamSession',
    resave: true,
    saveUninitialized: true}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new SteamStrategy({
        returnURL: 'http://localhost:3000/auth/steam/return',
        realm: 'http://localhost:3000/',
        apiKey: 'CDFE5EDDA78BCA4292CD44BE043BD6FF'
    },
    function(identifier, profile, done) {
        process.nextTick(function () {

            //TODO: here we need to add user to DB if they don't exist
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

//Test
var dbm = require(__dirname + '/DatabaseManager.js');

//Public Static Resources
app.use(express.static(path.join(__dirname, 'WebVC')));

//Set up handlebars view engine
app.set('views',path.join(__dirname, '/WebView'));
app.engine('hbs', exphbs({defaultLayout: 'main',
    extname:'.hbs',
    layoutsDir: path.join(__dirname, '/WebView/layouts')
}));
app.set('view engine', 'hbs');
app.get('/', function(req, res){
    if(req.isAuthenticated()) {
        res.render('index',{
            userName: req.user.displayName
        });
    }
    else{
        //TODO: Need a page here telling them to sign in
        res.render('welcomePage');
    }
});

//Ajax request is made here to search for games
app.get('/searchGames', function(req, res)
{
    var searchTerm = req.query.searchTerm;
    gameData.searchUpcomingGames(searchTerm, function(data)
    {
        res.send(data);
    });
});

app.get('/getArticles', function(req, res){
    var gameName = req.query.gameName;
    gameData.getNewsArticleInfo(gameName, function(data){
        res.send(data);
    });
});

app.get('/userTrackedGames', function(req, res){
    gameData.getUserTrackedGameData(req.user.identifier, function(gameDatas){
        res.send(gameDatas);
    });
});

app.post('/removeTrackedGame', function(req,res){
    gameData.removeGameIDFromUser(req.body.gameid, req.user.identifier);
    res.end();
});

app.post('/addTrackedGame', function(req,res)
{
    gameData.addTrackedGameId(req.body.gameid, req.user.identifier);
    res.end();
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
    req.logout();
    req.session.destroy(function(){

    });
    res.redirect('/');
});

app.get('/gameMedia', function(req, res){
    gameData.getMediaData(req.query.gameName, function(data){
        res.send(data);
    });
});

app.get('/test', function(req,res){

});

app.listen('3000');