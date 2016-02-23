var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
var app = express();
var bodyparser = require('body-parser');
var gameData = require(__dirname + '/gameDataProcessor.js');

app.use(bodyparser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyparser.json())

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
    });
});

app.get('/getArticles', function(req, res){
    var gameName = req.query.gameName;
    gameData.getNewsArticleInfo(gameName, function(data){
        res.send(data);
    });
});


//TODO: This should be based on Auth user
app.get('/userTrackedGames', function(req, res){
    gameData.getUserTrackedGameData(1111, function(gameDatas){
        res.send(gameDatas);
    });
});

app.post('/addTrackedGame', function(req,res)
{
    gameData.addTrackedGameId(req.body.gameid);
    res.end();
});

app.get('/test', function(req,res){

});

app.listen('3000');