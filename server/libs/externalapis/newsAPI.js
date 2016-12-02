/**
 * Created by Joey on 2/17/16.
 * Handles all requests to the BingAPI
 */
//require('dotenv').config();
var apiKey = process.env.BING_KEY;
var rootUri = 'https://api.datamarket.azure.com/Bing/Search';
var auth = new Buffer([apiKey, apiKey].join(':')).toString('base64');
var request = require('request').defaults({
    headers: {
        'Authorization': 'Basic ' + auth
    }
});
//var Bing = require('node-bing-api')({accKey: apiKey});

//Usable by requiring the module
module.exports = {
    getGameNews: function (gameName, callback) {
        getGameNews(gameName, callback);
    },
    getGameMedia: function (gameName, mediaDataHandler) {
        getGameMedia(gameName, mediaDataHandler);
    }

};

//Requests media data from the Bing web API
function getGameMedia(gameName, mediaDataHandler) {
    //We want video results
    var searchString = rootUri + '/Video';

    //Configure options and make request
    request.get({
        uri: searchString,
        qs: {
            $format: 'json',
            Query: "'" + gameName + "'"
        }
    }, function (err, res, body) {
            //Init our results array we will send to callback
            var resultsArray = [];
            var jsonRes = JSON.parse(body);
            var results = jsonRes.d.results;

            //For each result from the BingAPI, format our callback response object
            for (var i = 0; i < results.length; i++) {
                var curRes = results[i];
                resultsArray.push({
                    title: curRes.Title,
                    url: curRes.MediaUrl,
                    thumbnail: curRes.Thumbnail
                });
            }

            //callback
            mediaDataHandler(resultsArray);
        });
}

//Request news articles from the BingAPI
function getGameNews(gameName, callback) {
    //We want news
    var searchString = rootUri + '/News';
    request.get({
        uri: searchString,
        qs: {
            $format: 'json',
            Query: "'" + gameName + "'"
        }
    }, function (err, res, body) {

        //Init the callback response array
        var resultsArray = [];

        var jsonRes = JSON.parse(body);
        var results = jsonRes.d.results;

        //Process each result into something usable for us
        for (var i = 0; i < results.length; i++) {
            var curRes = results[i];
            resultsArray.push(
                {
                    title: curRes.Title,
                    url: curRes.Url,
                    desc: curRes.Description,
                    date: curRes.Date
                }
            );
        }

        //Pass to callback
        callback(resultsArray);
    });
}


