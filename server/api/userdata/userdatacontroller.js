'use strict';

var express = require('express');
var gameData = require('./userdataprocessor.js');

export function getUserTrackedGames(req, res){

        gameData.getUserTrackedGameData(req.user.identifier, function (gameDatas) {
            res.send(gameDatas);
        });
}

export function getAUsersTrackedGames(req, res)
{
    console.log('getting A users tracked games' + req.param('id'));
    var fullid = 'http://steamcommunity.com/openid/id/' + req.param('id');
    console.log('Full id: ' + fullid);
    gameData.getUserTrackedGameData(fullid, function(gameDatas){
        console.log(JSON.stringify(gameDatas));
        res.send(gameDatas);
    });
}

export function removeTrackedGame(req,res){

    console.log("REMOVING: " + req.params.gameid);
    gameData.removeTrackedGameId(req.params.gameid, req.user.identifier, function()
    {
        res.sendStatus(200);
        res.end();
    });

}

export function addTrackedGame(req,res)
{

    console.log("GAME ID TO ADD IS" + req.gameid);
    if(req.body.gameid != null) {
        gameData.addTrackedGameId(req.body.gameid, req.user.identifier, function () {
            res.sendStatus(200);
            res.end();
        });
    }
    else
    {
        //Missing param
        res.sendStatus(500);
        res.end();
    }
}

export function getFriendsTrackedGames(req,res){

    gameData.getSteamFriendsTrackedGames(req.user.id, function (tGames) {
        //Use this to show list on front end
        console.log("Friends Tracked Games for " + req.user.id + ": " + JSON.stringify(tGames));
        res.send(tGames);
        res.end();
    });
}