'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getUserTrackedGames = getUserTrackedGames;
exports.removeTrackedGame = removeTrackedGame;
exports.addTrackedGame = addTrackedGame;
exports.getFriendsTrackedGames = getFriendsTrackedGames;
var express = require('express');
var gameData = require('./userdataprocessor.js');

function getUserTrackedGames(req, res) {

    gameData.getUserTrackedGameData(req.user.identifier, function (gameDatas) {
        res.send(gameDatas);
    });
}

function removeTrackedGame(req, res) {

    gameData.removeTrackedGameId(req.body.gameid, req.user.identifier, function () {
        res.sendStatus(200);
        res.end();
    });
}

function addTrackedGame(req, res) {

    gameData.addTrackedGameId(req.body.gameid, req.user.identifier, function () {
        res.sendStatus(200);
        res.end();
    });
}

function getFriendsTrackedGames(req, res) {

    gameData.getSteamFriendsTrackedGames(req.user.id, function (tGames) {
        //Use this to show list on front end
        console.log("Friends Tracked Games for " + req.user.id + ": " + JSON.stringify(tGames));
        res.send(tGames);
        res.end();
    });
}

//# sourceMappingURL=userdatacontroller-compiled.js.map