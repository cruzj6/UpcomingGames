/**
 * Created by Joey on 3/21/16.
 */
require('./dataManagerService.js');
var app = angular.module('upcomingGames');
app.factory('httpReqService', function($http, $sce){

return{

searchForArticles: function(gameName, callback)
{
    //set up our options, we send the server the game name
    var options = {
        params:{
            gameName: gameName
        }
    };

    //Make the request, and assign the result to the newsArticles scope param
    //So that the view is updated
    $http.get('/info/articles', options).then(function(resp){
        callback(resp.data);
    });
},

searchForMedia: function(gameName, callback)
{
    var options = {
        params:{
            gameName: gameName
        }
    };
    //Make the request
    $http.get('/info/gameMedia', options).then(function(resp){
        //Filter out the video id to use it for the thumbnail
        var mediaDatas = [];

        for(var i = 0; i < resp.data.length; i++) {
            var respItem = resp.data[i];
            var urlSplit = respItem.url.split('/');

            //If this is a youtube video
            if(urlSplit[2].indexOf('youtube.com') > -1) {
                var QueryItems = function () {
                    var query_string = {};
                    var query = respItem.url;
                    var vars = query.split("?");
                    for (var i = 0; i < vars.length; i++) {
                        var pair = vars[i].split("=");
                        // If first entry with this name
                        if (typeof query_string[pair[0]] === "undefined") {
                            query_string[pair[0]] = decodeURIComponent(pair[1]);
                            // If second entry with this name
                        } else if (typeof query_string[pair[0]] === "string") {
                            var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
                            query_string[pair[0]] = arr;
                            // If third or later entry with this name
                        } else {
                            query_string[pair[0]].push(decodeURIComponent(pair[1]));
                        }
                    }
                    return query_string;
                }();

                //Get the v parameter which is the youtube video id
                var vidId = QueryItems.v;

                //Set up a custom object with the data and add it to the returned JSON array
                var mediaData = {
                    url: respItem.url,
                    title: respItem.title,
                    imgsrc: "https://img.youtube.com/vi/" + vidId + "/1.jpg"
                };
                mediaDatas.push(mediaData);
            }

        }
        for(var i=0; i< mediaDatas.length; i++)
        {
            $sce.trustAsResourceUrl(mediaDatas[i].url.replace("watch?v=", "embed/"));
        }
        //TODO: Other media platforms besides youtube
        callback(mediaDatas);
    });
},

searchForGames: function(searchTerms, callback)
{
    var searchInValue = encodeURIComponent(searchTerms);

    //Get our promise, make the request
    var httppromise = $http.get('/info/searchgames', {
        params:{
            //Additional data here ie->
            searchTerm: searchInValue
        }
    });

    //When we come back assign the result to the scope parameter for results
    httppromise.then(function(res){

        if(res.data.length > 0)
            callback(res.data);
        else {
            //If no results send empty instead of null
            callback([]);
        }
    });
},
addTrackedGamePost: function(gameId, callback)
{
    $http.post('/userdata/trackedGames', {
        gameid: gameId
    }).success(function(){
        callback();
    });
},
removeTrackedGamePost: function (gameId, callback)
{
    $http({ url: '/userData/trackedGames',
        method: 'DELETE',
        data: {gameid: gameId},
        headers: {"Content-Type": "application/json;charset=utf-8"}
    }).then(function(res) {
        callback();
    }, function(error) {
        console.log(error);
    });
},
getTrackedGames: function(callback)
{
    $http.get('/userdata/trackedGames').then(function(resp){
        callback(resp.data);
    });
},
getFriendsTrackedGames: function(callback)
{
    $http.get('/userdata/friendstrackedgames').then(function(resp)
    {
       callback(resp.data);
    });
},
getTopTrackedGames: function(callback)
{
    $http.get('/info/toptracked', {
        params: {
            number: 8
        }
    }).then(function(resp)
    {
        callback(resp.data);
    });
},

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
getAdvancedSearch: function(platform, month, year, keywords, callback)
{
console.log("making advanced search");
  $http.get('/info/advancedSearch', {
    params: {
      platform: platform,
      month: month,
      year: year,
      keywords: keywords
    }
  }).then(function(res){
      console.log("back from advanced search");
      callback(res.data);
  });
}

}
});
