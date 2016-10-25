/**
 * Created by Joey on 2/16/16.
 * This module handles all requests to the GiantBomb API
 */
//require('dotenv').config();
var apiKey = process.env.GB_KEY;
var giantBombAPI = 'http://www.giantbomb.com/api';
var request = require('request');
var _ = require('underscore-node');

export const ID_XBOX = '3045-145';
export const ID_PS4 = '3045-146';
export const ID_WIIU = '3045-139';
export const ID_PC = '3045-94';
export const ID_IOS = '3045-96';
export const ID_ANDROID = '3045-123';

//Giantbomb API search request and filters results to just upcoming games
//and returns an object with the info we want
export function searchForUpcomingGame(searchTerms, callback)
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
            var isTBD = (curResult.expected_release_year == null || curResult.expected_release_month == null ||
                        curResult.expected_release_day == null) && curResult.original_release_date == null;

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

export function getDataForGameById(gameId, handleIdGameData)
{
    if(gameId) {
        var queryString = giantBombAPI + "/game/" + gameId + "/?api_key=" + apiKey + '&format=json';

        //Make our http request to the API
        request.get({
            uri: queryString,
            headers: {'user-agent': 'UpcomingAwesomeGamesWoo'}//Required by API
        }, function (err, repond, body) {
            if (!err) {
                var jsonRes = JSON.parse(body);

                //Should be only one result since we are getting specific game by id not games
                var result = jsonRes.results;

                //Format our response JSON object
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

                //callback
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

export function advancedGamesQuery(gbQuery, callback)
{
    var gameResponses = [];
    var queryURI = giantBombAPI + '/games/?api_key=' + apiKey
                    + '&platforms=' + gbQuery.platforms + '&filter=';

    //Tack on filters
    if(gbQuery.expected_release_month != null)
    {
        queryURI += 'expected_release_month:' + gbQuery.expected_release_month + ',';
    }
    if(gbQuery.expected_release_year != null)
    {
        queryURI  += '&expected_release_year:' + gbQuery.expected_release_year + ',';
    }
    if(gbQuery.platforms != null)
    {
        queryURI += '&platforms:' + gbQuery.platforms;
    }


    //Empty response ph
    var jsonRes = {};
    queryURI += '&format=json';

    //Make our request to the API, need custom user agent as per their API
    console.log("Making Request to GB API: " + queryURI);
    request.get({uri: queryURI, headers:{'user-agent' : 'UpcomingAwesomeGamesWoo'}}, function (err, res, body) {
        jsonRes = JSON.parse(body);

        console.log(jsonRes);
        callback(jsonRes);
    });
}
