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

    console.log("Getting " + req.query.number + " top games");
    gameData.getTopTrackedGamesData(req.query.number, function (topArray) {
        console.log("Top Games List: " + topArray);
        res.send(topArray);
    });

}

//Object
/*
{
    platform: (all, pc, xbone, ps4, wiiu, ios, android),
    fromDate: <unixTime>,
    filter: {
        keywords: []
    }
}
 */
export function getAdvancedSearch(req, res)
{
    console.log("Gettting games Coming Soon: \nRequested: " + json.stringify(req));
    gameData.getAdvancedSearchData(req.query, function(data){
        console.log("Soon Coming Res: " + json.stringify(data));
        res.send(data);
    });
}