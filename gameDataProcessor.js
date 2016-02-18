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

function getNewsArticleInfo(gameName, callback)
{
    bingAPI.getGameNews(gameName, function(res){
       callback(res);
    });
}


