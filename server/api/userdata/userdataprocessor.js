/**
 * This file interacts with the giantBombAPI file,
 * this should be the only file that knows about the
 * giantAPI file, use this to process the data from gaintAPI,
 * and Bing News API
 * and provide helper methods to the router files
 */
'use strict'
var PATH_EXTERNAL_API = __dirname + '/../../libs/externalapis/';
var gameAPI = require(PATH_EXTERNAL_API + 'giantAPI');
var bingAPI = require(PATH_EXTERNAL_API + 'newsAPI');
var steamAPI = require(PATH_EXTERNAL_API + 'steamAPI');
import {UserDataModel} from './userdatamodel';
import _ from 'underscore-node';

//"public" functions, these are usable by any module that "requires" this module
module.exports = class UserDataProcessor {
    static getUserTrackedGameData(userId, handleTrackedGameData) {
        var dbm = new UserDataModel(userId);
        dbm.getUsersTrackedGameIds((err, ids) => {
            if(err){
                handleTrackedGameData(err, null);
            }
            console.log("IDS" + ids);
            //Filter out undefined or null items
            ids = _.filter(ids, (id) => id != undefined && id != "undefined" && id);

            //If we get any track gameIds
            if (ids && ids.length > 0) {
                //Init our return array
                var returnGameData = [];
                var successfulGets = 0; //Number of successful requests
                var attempts = 0; //Number of total requests

                //For each gameId we got back
                for (var i = 0; i < ids.length; i++) {
                    //Now request data about each game using the ID, and the giantBombAPI Module
                    gameAPI.getDataForGameById(ids[i], (gameData) => {

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
                            handleTrackedGameData(err, returnGameData);
                    });
                }
            } else {
                handleTrackedGameData(err, []);
            }
        });
    }

    //Use database manager module to add a tracked game for a user
    static addTrackedGameId(gameid, userid, doneCallback) {
        var dbm = new UserDataModel(userid);
        dbm.addGameIDToUser(gameid, doneCallback);
    }

    //Use database manager module to remove a tracked game
    static removeTrackedGameId(gameid, userid, doneCallback) {
        var dbm = new UserDataModel(userid);
        dbm.removeGameIDFromUser(gameid, doneCallback);
    }

    static getUserSteamId(userid, handleSteamId){
        var dbm = new UserDataModel(userid);
        dbm.getSteamId((err, id) => {
            handleSteamId(err, id);
        });
    }

    static setUserSteamId(userid, doneCallback){
         var dbm = new UserDataModel(userid);
        dbm.addSteamIdToUser((err) => {
           doneCallback(err);
        });
    }

    static getSteamFriendsTrackedGames(usersteamid, handleFriendsTrackedGames) {
        var friendsTrackedGames = [];
        var friendsDataGotten = 0;

        //Get all of the user's friends from the steam API
        steamAPI.getSteamFriends(usersteamid, (friendsDataArray) => {
            console.log(JSON.stringify(friendsDataArray));

            //Get the steam user info for each friend
            steamAPI.getSteamUsersInfo(_.pluck(friendsDataArray, "steamid"), (userDatas) => {
                //Get data for each friend
                for (var i = 0; i < friendsDataArray.length; i++) {

                    //The current friend we are getting data for
                    var curFriendid = friendsDataArray[i].steamid;

                    //Make the data request for each user's games
                    ((userid, userDatas) => {
                        module.exports.getUserTrackedGameData("http://steamcommunity.com/openid/id/" + userid, (trackGameData) => {

                            //Get the info for this user
                            var userInfo = _.where(userDatas.players, { steamid: userid })[0];

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
                    })(curFriendid, userDatas);
                }
            });


        });
    }
};

function getGameImageSource(gameid, callback) {
    gameAPI.getDataForGameById(gameid, function(response) {
        callback(response.imageLink);
    });
}