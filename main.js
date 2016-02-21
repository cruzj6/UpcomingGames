var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
var app = express();
var bodyparser = require('body-parser');
var gameData = require(__dirname + '/gameDataProcessor.js');

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
    res.render('index');
});

//Ajax request is made here to search for games
app.get('/searchGames', function(req, res)
{
    var searchTerm = req.query.searchTerm;
    gameData.searchUpcomingGames(searchTerm, function(data)
    {
        res.send(data);
        //TEST CODE
        gameData.getNewsArticleInfo(data[0].name, function(res){
           console.log(res);
        });
    });
});

app.get('/test', function(req,res){
   dbm.addGameIDToUser(2314, 1111);
    dbm.getUsersTrackedGameIds(1111, function(gameIds)
    {
        res.send(gameIds);
    });
});

app.listen('3000');