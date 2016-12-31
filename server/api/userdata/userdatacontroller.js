'use strict';

import express from 'express';
import gameData from './userdataprocessor.js';

module.exports = class UserDataController {
    static getUserTrackedGames(req, res) {

        gameData.getUserTrackedGameData(req.user.userid, (gameDatas) => {
            res.send(gameDatas);
        });
    }

    static getAUsersTrackedGames(req, res) {
        console.log('getting A users tracked games' + req.param('id'));
        console.log('Full id: ' + req.param('id'));
        gameData.getUserTrackedGameData(req.param('id'), (gameDatas) => {
            console.log(JSON.stringify(gameDatas));
            res.send(gameDatas);
        });
    }

    static removeTrackedGame(req, res) {

        console.log("REMOVING: " + req.body.gameid);
        console.log("REMOVING: " + req.param('gameid'));

        gameData.removeTrackedGameId(req.body.gameid, req.user.userid, () => {
            res.sendStatus(200);
            res.end();
        });
    }

    static addTrackedGame(req, res) {
        console.log("GAME ID TO ADD IS" + req.body.gameid);
        if (req.body.gameid != null) {
            gameData.addTrackedGameId(req.body.gameid, req.user.userid, () => {
                res.sendStatus(200);
                res.end();
            });
        } else {
            //Missing param
            res.sendStatus(500);
            res.end();
        }
    }

    static getFriendsTrackedGames(req, res) {

        /*gameData.getSteamFriendsTrackedGames(req.user.id, function (tGames) {
            //Use this to show list on front end
            console.log("Friends Tracked Games for " + req.user.id + ": " + JSON.stringify(tGames));
            res.send(tGames);
            res.end();
        });*/
        //TODO
        res.send(401);
        res.end();
    }
}