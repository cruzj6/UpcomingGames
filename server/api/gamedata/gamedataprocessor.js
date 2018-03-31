/**
 * Created by Joey on 4/4/16.
 */
import {GameDataModel} from './gamedatamodel';
var externalAPIPath = '../../libs/externalapis/';
var gameAPI = require('../../libs/externalapis/giantAPI');
var bingAPI = require('../../libs/externalapis/newsAPI');
var steamAPI = require('../../libs/externalapis/steamAPI');
var _ = require('underscore-node');
var moment = require('moment');
moment().format();

export function searchForGameByName(searchTerms, callback) {
    gameAPI.searchForGameByName(searchTerms, (response) => {
        callback(response);
    });
}

//Use bing API module to get News Article data
export function getNewsArticleInfo(gameName, callback) {
    bingAPI.getGameNews(gameName, (res) => {
        callback(res);
    });
}

//Use bing API module to get media data
export function getMediaData(gameName, callback) {
    bingAPI.getGameMedia(gameName, (res) => {
        callback(res);
    });
}

export function getTopTrackedGamesData(numToGet, handleTopTrackedData) {
    getTopTrackedGamesIds(20, (err, topTrackedArray) => {
        if(err){
            handleTopTrackedData(err, topTrackedArray);
        }

        //Just return the amount needed
        topTrackedArray = topTrackedArray.slice(0, numToGet);

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
            } else {
                //Current ID we are getting data for
                curID = topTrackedArray[i].id;

                //Get the game's data from Giant Bomb
                gameAPI.getDataForGameById(curID, (gameData) => {
                    topTrackedGameData.push(gameData);
                    numGotten++;

                    //Once we have gotten data for each game in the array
                    if (numGotten === topTrackedArray.length) {
                        console.log("Top Tracked Data: " + topTrackedGameData);
                        handleTopTrackedData(err, topTrackedGameData);
                    }
                });
            }
        }
    });
}

//Callsback with array, each element containing id and count
export function getTopTrackedGamesIds(numToGet, handleTopTrackedGames) {
    console.log("Entered Top tracked");
    GameDataModel.getAllTrackedIdsColumn((err, gameIds) => {
        if(err){
            handleTopTrackedGames(err, gameIds);
        }
        console.log("All Tracked Game IDs: " + JSON.stringify(gameIds));

        //Filter out any null or undefined entries
        gameIds = _.filter(gameIds, (id) => id != undefined && id != "undefined" && id);

        //Array for counting the number of times each game occurs
        var countArray = [];

        //For each Id in the DB first we need to count how many times it occurs
        for (var i = 0; i < gameIds.length; i++) {
            var curGameId = gameIds[i];
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
        var cArraySorted = _.sortBy(countArray, (game) => {
            return game.numTrack;
        });

        //log the array
        console.log("Top Tracked array Sorted: " + JSON.stringify(cArraySorted));

        //Build array to return with only the required number of elements
        var limitedArray = [];
        for (var k = cArraySorted.length - 1; k >= cArraySorted.length - numToGet; k--) {
            limitedArray.push(cArraySorted[k]);
        }

        //Finally return our data
        handleTopTrackedGames(err, limitedArray);

    });
}

export function getUpdatedReleaseDate(gameid, callback) {
    gameAPI.getDataForGameById(gameid, (results) => {
        //If we get data, format it and send it back to the callback
        if (results != null) {
            var dateInfo = {
                month: results.releaseMonth,
                day: results.releaseDay,
                year: results.releaseYear
            };

            callback(dateInfo);
        } else {
            callback(null);
        }
    });
}

/*
 {
 platform: (all, pc, xbone, ps4, wiiu, ios, android),
 month: <1-12>,
 year: <yyyy>,
 filters: {
    keywords: ""
 }
 }
 */
export function getAdvancedSearchData(query, callback) {

    var gbQuery = {};

    console.log(query.platform);
    //Check for platform and convert to giant bomb Platform id
    if (query.platform !== "all") {
        switch (query.platform) {
            case 'xbone':
                gbQuery.platform = gameAPI.ID_XBOX;
                break;
            case 'ps4':
                gbQuery.platform = gameAPI.ID_PS4;
                break;
            case 'pc':
                gbQuery.platform = gameAPI.ID_PC;
                break;
            case 'wiiu':
                gbQuery.platform = gameAPI.ID_WIIU;
                break;
            case 'switch':
                gbQuery.platform = gameAPI.ID_SWITCH;
            case 'ios':
                gbQuery.platform = gameAPI.ID_IOS;
                break;
            case '':
                gbQuery.platform = gameAPI.ID_3DS;
            case 'android':
                gbQuery.platform = gameAPI.ID_ANDROID;
                break;
            default:
                gbQuery.platform = null;
        }
    }

    //Timeframe
    gbQuery.expected_release_month = query.month;
    gbQuery.expected_release_year = query.year;

    var filters = JSON.parse(query.filters);
    //Keywords
    gbQuery.query = filters.keywords;
    console.log(filters);

    try {
        //Make request through games API
        gameAPI.advancedGamesQuery(gbQuery, (data) => {
            callback(data);
        });
    } catch (e) {
        console.log("Error making Giant Bomb API Query: " + e.message);
    }

}