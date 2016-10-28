/**
 * Created by Joey on 4/4/16.
 */
var externalAPIPath = '/../../libs/externalapis/';
var gameAPI = require(__dirname + externalAPIPath + 'giantAPI');
var bingAPI = require(__dirname + externalAPIPath + 'newsAPI');
var steamAPI = require(__dirname + externalAPIPath + 'steamAPI');
var dbm = require(__dirname + '/gamedatamodel');
var _ = require('underscore-node');
var moment = require('moment');
moment().format();

export function searchUpcomingGames(searchTerms, callback){
    gameAPI.searchForUpcomingGame(searchTerms, function (response) {
        callback(response);
    });
}

//Use bing API module to get News Article data
export function getNewsArticleInfo(gameName, callback) {
    bingAPI.getGameNews(gameName, function (res) {
        callback(res);
    });
}

//Use bing API module to get media data
export function getMediaData(gameName, callback) {
    bingAPI.getGameMedia(gameName, function (res) {
        callback(res);
    });
}

export function getTopTrackedGamesData(numToGet, handleTopTrackedData) {
    getTopTrackedGamesIds(numToGet, function (topTrackedArray) {
        //Contains actual data for each game
        var topTrackedGameData = [];
        var numGotten = 0;

        //For each top game (each elemnt has id and count)
        for (var i = 0; i < topTrackedArray.length; i++) {
            var curID;

            //If this is null (We have <5 tracked games)
            //increment the num gotten to let the callback know to
            //call handleTopTRackedData sooner
            if (!topTrackedArray[i]) {
                numGotten++;
            }
            else {
                //Current ID we are getting data for
                curID = topTrackedArray[i].id;

                //Get the game's data from Giant Bomb
                gameAPI.getDataForGameById(curID, function (gameData) {
                    topTrackedGameData.push(gameData);
                    numGotten++;

                    //Once we have gotten data for each game in the array
                    if (numGotten === topTrackedArray.length) {
                        console.log("Top Tracked Data: " + topTrackedGameData);
                        handleTopTrackedData(topTrackedGameData);
                    }
                });
            }
        }
    });
}

//Callsback with array, each element containing id and count
export function getTopTrackedGamesIds(numToGet, handleTopTrackedGames) {
    console.log("Entered Top tracked");
    dbm.getAllTrackedIdsColumn(function (gameIds) {
        console.log("All Tracked Game IDs: " + JSON.stringify(gameIds));

        //Array for counting the number of times each game occurs
        var countArray = [];

        //For each Id in the DB first we need to count how many times it occurs
        for (var i = 0; i < gameIds.length; i++) {
            var curGameId = gameIds[i].gameid;
            var gameAccountedFor = false;

            //Check if we have started counting for this game
            for (var j = 0; j < countArray.length; j++) {
                //If we find it add one to the count
                if (countArray[j].id === curGameId) {
                    gameAccountedFor = true;
                    countArray[j].numTrack++;
                }
            }

            //If the game is not there, add it and start at 1
            if (!gameAccountedFor) {
                countArray.push({
                    id: curGameId,
                    numTrack: 1
                })
            }
        }

        //Now get the most occuring games
        var cArraySorted = _.sortBy(countArray, function (game) {
            return game.numTrack;
        });

        //log the array
        console.log("Top Tracked array Sorted: " + JSON.stringify(cArraySorted));

        //Build array to return with only the required number of elements
        var limitedArray = [];
        for (var k = cArraySorted.length - 1; k >=  cArraySorted.length - numToGet; k--) {
            limitedArray.push(cArraySorted[k]);
        }

        //Finally return our data
        handleTopTrackedGames(limitedArray);

    });
}

export function getUpdatedReleaseDate(gameid, callback) {
    gameAPI.getDataForGameById(gameid, function (results) {
        //If we get data, format it and send it back to the callback
        if (results != null) {
            var dateInfo = {
                month: results.releaseMonth,
                day: results.releaseDay,
                year: results.releaseYear
            };

            callback(dateInfo);
        }
        else {
            callback(null);
        }
    });
}

/*
 {
 platform: (all, pc, xbone, ps4, wiiu, ios, android),
 month: <1-12>,
 year: <yyyy>,
 filter: {
    keywords: []
 }
 }
 */
export function getAdvancedSearchData(query, callback) {

    var gbQuery = {};

    console.log(query.platform);
    //Check for platform and convert to giant bomb Platform id
    if(query.platform !== "all")
    {
        switch(query.platform)
        {
            case 'xbone':
                gbQuery.platform = gameAPI.ID_XBOX;
                break;
            case 'ps4' :
                gbQuery.platform = gameAPI.ID_PS4;
                break;
            case 'pc' :
                gbQuery.platform = gameAPI.ID_PC;
                break;
            case 'wiiu' :
                gbQuery.platform = gameAPI.ID_WIIU;
                break;
            case 'ios' :
                gbQuery.platform = gameAPI.ID_IOS;
                break;
            case 'android' :
                gbQuery.platform = gameAPI.ID_ANDROID;
                break;
            default:
                gbQuery.platform = null;
        }
    }

    //Timeframe
    gbQuery.expected_release_month = query.month;
    gbQuery.expected_release_year = query.year;

    //Query keywords
    if(query.filters != null)
        gbQuery.query = query.filters.keywords;

    try {
        //Make request through games API
        gameAPI.advancedGamesQuery(gbQuery, function (data) {
            callback(data);
        });
    }
    catch(e)
    {
        console.log("Error making Giant Bomb API Query: " + e.message);
    }

}
