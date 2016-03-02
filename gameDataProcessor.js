/**
 * Created by Joey on 2/17/16.
 * This file interacts with the giantBombAPI file,
 * this should be the only file that knows about the
 * giantAPI file, use this to process the data from gaintAPI,
 * and Bing News API
 * and provide helper methods to the router files
 */
var gameAPI = require(__dirname + '/giantAPI.js');
var bingAPI = require(__dirname + '/newsAPI.js');
var dbm = require(__dirname + '/DatabaseManager.js');

//"public" functions, these are usable by any module that "requires" this module
module.exports = {
    getUpdatedReleaseDate: function(gameid, callback)
    {
        getUpdatedReleaseDate(gameid, callback);
    },

    searchUpcomingGames: function(searchTerms, callback)
    {
        searchUpcomingGames(searchTerms, callback);
    },
    getNewsArticleInfo: function(gameName, callback){
        getNewsArticleInfo(gameName, callback);
    },

    getUserTrackedGameData: function(userId, callback)
    {
        getUserTrackedGameData(userId, callback);
    },

    addTrackedGameId: function(gameId, userid, doneCallback){
        addTrackedGameId(gameId, userid, doneCallback);
    },
    getMediaData: function(gameName, callback){
        getMediaData(gameName, callback);
    },
    removeTrackedGameId: function(gameId, userId, doneCallback){
        removeTrackedGameId(gameId, userId, doneCallback);
    }
};

function searchUpcomingGames(searchTerm, callback)
{
    gameAPI.searchForUpcomingGame(searchTerm, function(response){
        callback(response);
    });
}

function getGameImageSource(gameid, callback)
{
    gameAPI.getDataForGameById(gameid, function(response){
        callback(response.imageLink);
    });
}

function getUpdatedReleaseDate(gameid, callback)
{
    gameAPI.getDataForGameById(gameid, function(results)
    {
        //If we get data, format it and send it back to the callback
        if(results != null) {
            var dateInfo = {
                month: results.releaseMonth,
                day: results.releaseDay,
                year: results.releaseYear
            };

            callback(dateInfo);
        }
        else
        {
            callback(null);
        }
    });
}

function getUserTrackedGameData(userId, handleTrackedGameData)
{
    dbm.getUsersTrackedGameIds(userId, function(ids){
        //If we get any track gameIds
        if(ids && ids.length > 0){
            //Init our return array
            var returnGameData = [];
            var successfulGets = 0;//Number of successful requests
            var attempts = 0;//Number of total requests

            //For each gameId we got back
            for (var i = 0; i < ids.length; i++)
            {
                //Now request data about each game using the ID, and the giantBombAPI Module
                gameAPI.getDataForGameById(ids[i].gameId, function(gameData){
                    //Track attempts to get game data, and number actually gotten (successful)
                    //We need to keep track since this is Async, so we know when to make callback
                    attempts++;
                    if(gameData) {
                        returnGameData.push(gameData);
                        successfulGets++;
                    }

                    //If we made all our attempts, call the original callback for the getUserTrackedGameData() functions
                    //and send it all of the tracked games data
                    if(returnGameData.length == successfulGets && attempts == ids.length)
                        handleTrackedGameData(returnGameData);
                });
            }
        }
        else
        {
            handleTrackedGameData([]);
        }
        });
}

//Use bing API module to get media data
function getMediaData(gameName, callback)
{
    bingAPI.getGameMedia(gameName, function(res){
        callback(res);
    });
}

//Use bing API module to get News Article data
function getNewsArticleInfo(gameName, callback)
{
    bingAPI.getGameNews(gameName, function(res){
       callback(res);
    });
}

//Use database manager module to remove a tracked game
function removeTrackedGameId(gameId, userId, doneCallback)
{
    dbm.removeGameIDFromUser(gameId, userId, doneCallback);
}

//Use database manager module to add a tracked game for a user
function addTrackedGameId(gameId, userid, doneCallback)
{
    dbm.addGameIDToUser(gameId, userid, doneCallback);
}



