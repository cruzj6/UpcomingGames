/**
 * Created by Joey on 2/16/16.
 */
var apiKey = 'c14fff77465764e0e79d64ed7b5e1bd380808165';
var giantBombAPI = 'http://www.giantbomb.com/api';
var request = require('request');
var _ = require('underscore-node');

var returnDataStruct =
{
    name: null,
    imageLink: null,
    platforms: null,
    releaseMonth: null,
    releaseYear: null,
    releaseDay: null,
    gbGameId: null //GB database game id
};

//All of our "public" functions
module.exports = {

    //Searches for a game and returns relevant info to callback
    searchForUpcomingGame: function(searchTerms, callback) {
      searchForUpcomingGame(searchTerms, callback);
    },

    getDataForGameById: function(gameId, callback)
    {
        getDataForGameByID(gameId, callback);
    }

};

//Giantbomb API search request and filters results to just upcoming games
//and returns an object with the info we want
function searchForUpcomingGame(searchTerms, callback)
{
    var todaysDate = new Date();

    //This will be our callback response
    var gameResponses = [];
    var jsonRes;
    var searchString = giantBombAPI + '/search/?api_key=' + apiKey +
       '&format=json' + '&query=' + searchTerms + "&resources=game";

    var qus = {
        format: 'json',
        query: searchTerms,
        resources: 'game',
        api_key: apiKey
    };

    //Make our request to the API, need custom user agent as per their API
    request.get({uri: searchString, headers:{'user-agent' : 'UpcomingAwesomeGamesWoo'}}, function (err, res, body) {

        jsonRes = JSON.parse(body);

        //Results key value -> array of results
        var results = jsonRes.results;

        //For each result
        for(var i = 0; i < results.length; i++)
        {
            //Easier to work with
            var curResult = results[i];

            //If this game is TBD or has a future date we want it
            var islater = curResult.expected_release_year >= todaysDate.getYear() &&
                curResult.expected_release_month >= todaysDate.getMonth() + 1 &&
                curResult.expected_release_day >= todaysDate.getDay() + 1;
            var isTBD = (curResult.original_release_date == null);

            if(islater || isTBD) {
                //Just need the name from each platform
                var resultsPlatforms = _.pluck(curResult.platforms, 'name');

                //Build our response object and add it to the response array
                gameResponses.push({
                    name: results[i].name,
                    imageLink: curResult.image != null ? curResult.image.icon_url :
                        "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg",
                    platforms: resultsPlatforms,
                    releaseMonth: curResult.expected_release_month,
                    releaseYear: curResult.expected_release_year,
                    releaseDay: curResult.expected_release_day,
                    gbGameId: curResult.id //We can store just this in db
                });
            }
        }
        //Send callback
        callback(gameResponses);
    });
}

function getDataForGameByID(gameId, handleIdGameData)
{
    if(gameId) {
        var queryString = giantBombAPI + "/game/" + gameId + "/?api_key=" + apiKey + '&format=json';
        request.get({
            uri: queryString,
            headers: {'user-agent': 'UpcomingAwesomeGamesWoo'}
        }, function (err, repond, body) {
            if (!err) {
                var jsonRes = JSON.parse(body);

                //Should be only one result since we are getting specific game by id not games
                var result = jsonRes.results;
                var gameDatas = {
                    name: result.name,
                    imageLink: result.image != null ? result.image.icon_url :
                        "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg",
                    platforms: _.pluck(result.platforms, 'name'),
                    releaseMonth: result.expected_release_month,
                    releaseYear: result.expected_release_year,
                    releaseDay: result.expected_release_day,
                    gbGameId: result.id //We can store just this in db
                };

                handleIdGameData(gameDatas);
            }
            else(handleIdGameData(null));
        });
    }
    else
    {
        handleIdGameData(null);
    }
}

