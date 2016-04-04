var express = require('express');
var router = express.Router();
var gameData = require('../gameDataProcessor.js');

router.get('/userTrackedGames', function(req, res){
    gameData.getUserTrackedGameData(req.user.identifier, function(gameDatas){
        res.send(gameDatas);
    });
});

router.post('/removeTrackedGame', function(req,res){
    gameData.removeTrackedGameId(req.body.gameid, req.user.identifier, function()
    {
        res.sendStatus(200);
        res.end();
    });

});

router.post('/addTrackedGame', function(req,res)
{
    gameData.addTrackedGameId(req.body.gameid, req.user.identifier, function(){
        res.sendStatus(200);
        res.end();
    });

});

router.get('/topTracked', function(req, res)
{
    gameData.getTopTrackedGamesData(5, function(topArray)
    {
        console.log("Top Games List: " + topArray);
        res.send(topArray);
    });
});

module.exports = router;