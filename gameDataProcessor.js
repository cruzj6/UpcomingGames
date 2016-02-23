/**
 * Created by Joey on 2/17/16.
 * This file interacts with the giantBombAPI file,
 * this should be the only file that knows about the
 * giantAPI file, use this to process the data from gaintAPI,
 * and Bing News API
 * and provide helper methods to the main.js file
 */
var gameAPI = require(__dirname + '/giantAPI.js');
var bingAPI = require(__dirname + '/newsAPI.js');
var dbm = require(__dirname + '/DatabaseManager.js');

module.exports = {
    //"public" functions
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

    addTrackedGameId: function(gameId){
        addTrackedGameId(gameId);
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

function addTrackedGameId(gameId)
{
    dbm.addGameIDToUser(gameId, 1111);
}

function getUserTrackedGameData(userId, handleTrackedGameData)
{
    dbm.getUsersTrackedGameIds(userId, function(ids){
        if(ids){
        var returnGameData = [];
        var successfulGets = 0;
        var attempts = 0;
        for (var i = 0; i < ids.length; i++)
        {
            gameAPI.getDataForGameById(ids[i].gameId, function(gameData){
                //Track attempts to get game data, and number actually gotten (successful)
                attempts++;
                if(gameData) {
                    returnGameData.push(gameData);
                    successfulGets++;
                }
                if(returnGameData.length == successfulGets && attempts == ids.length)
                    handleTrackedGameData(returnGameData);

            });
        }
    }});

}

function getNewsArticleInfo(gameName, callback)
{
    bingAPI.getGameNews(gameName, function(res){
       callback(res);
    });
}


