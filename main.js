var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
var app = express();
var bodyparser = require('body-parser');
var gameAPI = require(__dirname + '/giantAPI.js');

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
    res.render('index');
});

//Ajax request is made here to search for games
app.get('/searchGames', function(req, res)
{
    var searchTerm = req.query.searchTerm;
    gameAPI.searchForUpcomingGame(searchTerm, function(response){
       res.send(response);
    });

});


//Use here to test our API stuff
app.get('/testAPI', function(req, res)
{

    gameAPI.searchForUpcomingGame('uncharted', function(searchTest){
        res.render('APITest', {
            Testing: "Hello Test",
            testImage: searchTest[0].imageLink
        });
    });

});

app.listen('3000');