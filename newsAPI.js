/**
 * Created by Joey on 2/17/16.
 */
var apiKey = 'j4LUpBCJOWXZE88djOwX+NRh9OqKjj/UukDK7kGcp/8';
var rootUri = 'https://api.datamarket.azure.com/Bing/Search';
var auth = new Buffer([ apiKey, apiKey ].join(':')).toString('base64');
var request = require('request').defaults({
    headers:{
        'Authorization' : 'Basic ' + auth
    }
});
//var Bing = require('node-bing-api')({accKey: apiKey});

module.exports = {
    getGameNews: function(gameName, callback) {
        getGameNews(gameName, callback);
    },
    getGameMedia: function(gameName, mediaDataHandler)
    {
        getGameMedia(gameName, mediaDataHandler);
    }

};

function getGameMedia(gameName, mediaDataHandler)
{
    var searchString = rootUri + '/Video';
    request.get({
        uri: searchString,
        qs:{
            $format:'json',
            Query: "'" + gameName + "'"
        }
    }, function(err, res, body)
    {
        var resultsArray = [];
        var jsonRes = JSON.parse(body);
        var results = jsonRes.d.results;

        for(var i = 0; i < results.length; i++)
        {
            var curRes = results[i];
            resultsArray.push({
                title: curRes.Title,
                url: curRes.MediaUrl,
                thumbnail: curRes.Thumbnail
            });
        }
        mediaDataHandler(resultsArray);
    });
}

function getGameNews(gameName, callback)
{
    var searchString = rootUri + '/News';
    request.get({
        uri: searchString,
        qs:{
            $format:'json',
            Query: "'" + gameName + "'"
        }
    }, function(err, res, body){
        var resultsArray = [];

        var jsonRes = JSON.parse(body);
        var results = jsonRes.d.results;

        //Process each result into something usable for us
        for(var i = 0; i < results.length;i++){
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


