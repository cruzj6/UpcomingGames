/**
 * Created by Joey on 3/1/2016.
 */
var express = require('express');
var router = express.Router();
var gameData = require('../gameDataProcessor.js');

//Ajax request is made here to search for games
router.get('/searchGames', function(req, res)
{
    //Get the search term from the request
    var searchTerm = req.query.searchTerm;

    //Make a call to the gameData module
    gameData.searchUpcomingGames(searchTerm, function(data)
    {
        res.send(data);
    });
});

//When request is made for news articles about a game
router.get('/getArticles', function(req, res){
    //Get the name of the game from the request
    var gameName = req.query.gameName;

    //Reqeust news article data from the gameDataProcessor
    gameData.getNewsArticleInfo(gameName, function(data){
        res.send(data);
    });
});

//When request is made for media on the game
router.get('/gameMedia', function(req, res){
    //Request media data from gameDataProcessor, providing it the requested gameName
    gameData.getMediaData(req.query.gameName, function(data){
        res.send(data);
    });
});

router.get('/getFriendsTrackedGames', function(req,res){
    gameData.getSteamFriendsTrackedGames(req.user.id, function(tGames){
        //Use this to show list on front end
        console.log("Friends Tracked Games for " + req.user.id + ": " + JSON.stringify(tGames));
        res.send(tGames);
        res.end();
    });
});

module.exports = router;