/**
 * Created by Joey on 3/1/2016.
 */
var express = require('express');
var gameData = require('./gamedataprocessor.js');

//Ajax request is made here to search for games
export function searchGames(req, res)
{

        //Get the search term from the request
        var searchTerm = req.query.searchTerm;

        //Make a call to the gameData module
        gameData.searchUpcomingGames(searchTerm, function (data) {
            res.send(data);
        });
}

//When request is made for news articles about a game
export function getArticles(req, res){

        //Get the name of the game from the request
        var gameName = req.query.gameName;

        //Reqeust news article data from the gameDataProcessor
        gameData.getNewsArticleInfo(gameName, function (data) {
            res.send(data);
        });
}

//When request is made for media on the game
export function gameMedia(req, res){

            //Request media data from gameDataProcessor, providing it the requested gameName
            gameData.getMediaData(req.query.gameName, function (data) {
                res.send(data);
            });
}


export function getTopTrackedGames(req, res)
{

    gameData.getTopTrackedGamesData(5, function (topArray) {
        console.log("Top Games List: " + topArray);
        res.send(topArray);
    });

}
