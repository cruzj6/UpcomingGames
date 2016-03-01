/**
 * Created by Joey on 3/1/2016.
 */
var express = require('express');
var router = express.Router();
var gameData = require('../gameDataProcessor.js');

router.get('/userTrackedGames', function(req, res){
    gameData.getUserTrackedGameData(req.user.identifier, function(gameDatas){
        res.send(gameDatas);
    });
});

router.post('/removeTrackedGame', function(req,res){
    gameData.removeGameIDFromUser(req.body.gameid, req.user.identifier);
    res.end();
});

router.post('/addTrackedGame', function(req,res)
{
    gameData.addTrackedGameId(req.body.gameid, req.user.identifier);
    res.end();
});

module.exports = router;