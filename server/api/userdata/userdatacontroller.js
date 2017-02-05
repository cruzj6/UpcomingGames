'use strict';

import express from 'express';
import gameData from './userdataprocessor.js';

module.exports = class UserDataController {
    static getUserTrackedGames(req, res) {

        gameData.getUserTrackedGameData(req.user.userid, (err, gameDatas) => {
            if (err) {
                res.sendStatus(500).send({});
            }
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
        if (req.body.gameid != null && req.body.gameid != undefined && req.body.gameid != "undefined" && req.body.gameid) {
            gameData.addTrackedGameId(req.body.gameid, req.user.userid, (err) => {
                let isAlreadyTracked = false;
                if (err) {
                    isAlreadyTracked = true;
                }
                res.status(200).send({ alreadyTracked: isAlreadyTracked });
                res.end();
            });
        } else {
            //Missing param
            res.sendStatus(500);
            res.end();
        }
    }

    static getSteamId(req, res) {
        gameData.getUserSteamId(req.user.userid, (err, id) => {
            if (err) {
                res.sendStatus(404);
            }
            else {
                res.send(id);
            }
        });
    }

    static setSteamId(req, res) {
        gameData.addSteam((err) => {
            if (err) {
                res.sendStatus(404);
            }
            else {
                res.sendStatus(200);
            }
        });
    }

    static getFriendsTrackedGames(req, res) {
        gameData.getUserSteamId(req.user.userid, (err, id) => {
            if (err) {
                res.sendStatus(404);
            }
            else {
                gameData.getSteamFriendsTrackedGames(req.user.id, function (tGames) {
                    //Use this to show list on front end
                    console.log("Friends Tracked Games for " + req.user.id + ": " + JSON.stringify(tGames));
                    res.send(tGames);
                    res.end();
                });
            }
        });
    }
}