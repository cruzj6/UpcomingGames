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
var steamAPI = require(__dirname + '/steamAPI');
var _ = require('underscore-node');

//"public" functions, these are usable by any module that "requires" this module
module.exports = {
    getUpdatedReleaseDate: function (gameid, callback) {
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
    },

    searchUpcomingGames: function (searchTerms, callback) {
        gameAPI.searchForUpcomingGame(searchTerms, function (response) {
            callback(response);
        });
    },

    //Use bing API module to get News Article data
    getNewsArticleInfo: function (gameName, callback) {
        bingAPI.getGameNews(gameName, function (res) {
            callback(res);
        });
    },

    getUserTrackedGameData: function (userId, handleTrackedGameData) {
        dbm.getUsersTrackedGameIds(userId, function (ids) {
            //If we get any track gameIds
            if (ids && ids.length > 0) {
                //Init our return array
                var returnGameData = [];
                var successfulGets = 0;//Number of successful requests
                var attempts = 0;//Number of total requests

                //For each gameId we got back
                for (var i = 0; i < ids.length; i++) {
                    //Now request data about each game using the ID, and the giantBombAPI Module
                    gameAPI.getDataForGameById(ids[i].gameid, function (gameData) {
                        //Track attempts to get game data, and number actually gotten (successful)
                        //We need to keep track since this is Async, so we know when to make callback
                        attempts++;
                        if (gameData) {
                            returnGameData.push(gameData);
                            successfulGets++;
                        }

                        //If we made all our attempts, call the original callback for the getUserTrackedGameData() functions
                        //and send it all of the tracked games data
                        if (returnGameData.length == successfulGets && attempts == ids.length)
                            handleTrackedGameData(returnGameData);
                    });
                }
            }
            else {
                handleTrackedGameData([]);
            }
        });
    },

    //Use database manager module to add a tracked game for a user
    addTrackedGameId: function (gameId, userid, doneCallback) {
        dbm.addGameIDToUser(gameId, userid, doneCallback);
    },

    //Use bing API module to get media data
    getMediaData: function (gameName, callback) {
        bingAPI.getGameMedia(gameName, function (res) {
            callback(res);
        });
    },

    //Use database manager module to remove a tracked game
    removeTrackedGameId: function (gameId, userId, doneCallback) {
        dbm.removeGameIDFromUser(gameId, userId, doneCallback);
    },

    getSteamFriendsTrackedGames: function (usersteamid, handleFriendsTrackedGames) {
        var friendsTrackedGames = [];
        var friendsDataGotten = 0;

        //Get all of the user's friends from the steam API
        steamAPI.getSteamFriends(usersteamid, function (friendsDataArray) {
            console.log(JSON.stringify(friendsDataArray));

             //Get the steam user info for each friend
             steamAPI.getSteamUsersInfo(_.pluck(friendsDataArray, "steamid"), function(userDatas)
             {
                 //Get data for each friend
                 for (var i = 0; i < friendsDataArray.length; i++) {

                     //The current friend we are getting data for
                     var curFriendid = friendsDataArray[i].steamid;

                     //Make the data request for each user's games
                     (function (userid, userDatas) {
                         module.exports.getUserTrackedGameData("http://steamcommunity.com/openid/id/" + userid, function (trackGameData) {

                             //Get the info for this user
                             var userInfo = _.where(userDatas.players, {steamid: userid})[0];

                             //Push this to the array, each object contains
                             //firends steamID and array of their tracked games
                             //each with full data
                             friendsTrackedGames.push({
                                 avatar: userInfo.avatar,
                                 userid: userInfo.personaname,
                                 gameData: trackGameData
                             });
                             friendsDataGotten++;
                             if (friendsDataGotten == friendsDataArray.length) {
                                 handleFriendsTrackedGames(friendsTrackedGames);
                             }
                         });
                     }(curFriendid, userDatas));
                 }
             });


        });
    },

    getTopTrackedGamesData: function(numToGet, handleTopTrackedData)
    {
        module.exports.getTopTrackedGamesIds(numToGet, function(topTrackedArray){
            //Contains actual data for each game
            var topTrackedGameData = [];
            var numGotten = 0;

            //For each top game (each elemnt has id and count)
            for(var i=0; i<topTrackedArray.length; i++)
            {
                var curID;

                //If this is null (We have <5 tracked games)
                //increment the num gotten to let the callback know to
                //call handleTopTRackedData sooner
                if(!topTrackedArray[i])
                {
                    numGotten++;
                }
                else
                {
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
    },

    //Callsback with array, each element containing id and count
    getTopTrackedGamesIds: function(numToGet, handleTopTrackedGames){
        console.log("Entered Top tracked");
        dbm.getAllTrackedIdsColumn(function(gameIds)
        {
            console.log("All Tracked Game IDs: " + JSON.stringify(gameIds));

            //Array for counting the number of times each game occurs
            var countArray = [];

            //For each Id in the DB first we need to count how many times it occurs
            for(var i=0; i<gameIds.length; i++)
            {
                var curGameId = gameIds[i].gameid;
                var gameAccountedFor = false;

                //Check if we have started counting for this game
                for(var j=0; j< countArray.length; j++)
                {
                    //If we find it add one to the count
                    if(countArray[j].id === curGameId)
                    {
                        gameAccountedFor = true;
                        countArray[j].numTrack++;
                    }
                }

                //If the game is not there, add it and start at 1
                if(!gameAccountedFor)
                {
                    countArray.push({
                        id: curGameId,
                        numTrack: 1
                    })
                }
            }

            //Now get the most occuring games
            _.sortBy(countArray, function(game){
                return game.numTrack;
            });

            //Build array to return with only the required number of elements
            var limitedArray = [];
            for(var k=0; k<numToGet; k++)
            {
                limitedArray.push(countArray[k]);
            }

            //Finally return our data
            handleTopTrackedGames(limitedArray);

        });
    }
};

function getGameImageSource(gameid, callback)
{
    gameAPI.getDataForGameById(gameid, function(response){
        callback(response.imageLink);
    });
}




