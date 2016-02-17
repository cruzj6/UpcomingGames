/**
 * Created by Joey on 2/16/16.
 */
var apiKey = 'c14fff77465764e0e79d64ed7b5e1bd380808165';
var giantBombAPI = 'http://www.giantbomb.com/api';
var request = require('request');
var _ = require('underscore-node');

//All of our "public" functions
module.exports = {

    //Searches for a game and returns relevant info to callback
    searchForUpcomingGame: function(searchTerms, callback) {
      return searchForUpcomingGame(searchTerms, callback);
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
    var searchString = giantBombAPI + '/search?api_key=' + apiKey +
        '&format=json' + '&query=' + searchTerms + "&resources=game";

    //Make our request to the API
    request(searchString, function (err, res, body) {

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
