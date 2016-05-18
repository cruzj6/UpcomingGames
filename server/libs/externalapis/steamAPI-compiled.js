"use strict";

/**
 * Created by Joey on 3/23/16.
 */
//require('dotenv').config();
var request = require('request');
var apiKey = process.env.STEAM_API_KEY;

module.exports = {
    getUserOwnedGames: function getUserOwnedGames(userSteamId, handleOwnedGamesData) {

        //Build steam API Query
        var query = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=" + apikey + "&include_appinfo=1&steamid=" + userSteamId + "&format=json";

        //Make our request
        request.get(query, function (err, res, body) {
            var jsonData = JSON.parse(body);
            var resp = jsonData.response;

            //Get the games data
            var games = resp.games;

            //callback
            handleOwnedGamesData(games);
        });
    },
    //TODO: We can get steam friends tracked games (Future facebook etc too)!
    getSteamFriends: function getSteamFriends(userSteamId, handleFriendsData) {
        //Build query
        var query = "http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?" + "key=" + apiKey + "&steamid=" + userSteamId + "&relationship=friend";

        //Make request
        request.get(query, function (err, res, body) {
            var jsonData = JSON.parse(body);
            var friendsList = jsonData.friendslist;

            //Get the Friends data
            var friendsArray = friendsList.friends;

            console.log('GetFriendList Request: ' + JSON.stringify(friendsArray));

            //Contains "steamid", "relationship" (ie. 'friend'), and "friend_since"
            //for each friend
            handleFriendsData(friendsArray);
        });
    },
    getSteamUsersInfo: function getSteamUsersInfo(userSteamIdArray, handleFriendUserInfo) {
        //Build comma delimited list
        var queryidstring = "";
        for (var i = 0; i < userSteamIdArray.length; i++) {
            queryidstring += userSteamIdArray[i] + ",";
        }
        console.log("Getting user info using query: " + queryidstring);

        //Build query
        var query = " http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?" + "key=" + apiKey + "&steamids=" + queryidstring;

        request.get(query, function (err, res, body) {
            var jsonData = JSON.parse(body);
            console.log("Got all users data: " + JSON.stringify(jsonData));
            handleFriendUserInfo(jsonData.response);
        });
    }
};

//# sourceMappingURL=steamAPI-compiled.js.map