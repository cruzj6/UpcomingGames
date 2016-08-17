/**
 * Created by Joey on 3/21/16.
 */
require('./dataManagerService.js');
var app = angular.module('upcomingGames');
app.factory('httpReqService', function($http, $sce){

    return{
        searchForArticles: function(gameName, articleDataHandler)
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
                articleDataHandler(resp.data);
            });
        },

        searchForMedia: function(gameName, mediaDataHandler)
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
                mediaDataHandler(mediaDatas);
            });
        },

        searchForGames: function(searchTerms, searchDataHandler)
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
                    searchDataHandler(res.data);
                else {
                    //If no results send empty instead of null
                    searchDataHandler([]);
                }
            });
        },
        addTrackedGamePost: function(gameId, onSuccessHandler)
        {
            $http.post('/userdata/trackedGames', {
                gameid: gameId
            }).success(function(){
                onSuccessHandler();
            });
        },
        removeTrackedGamePost: function (gameId, onSuccessHandler)
        {
            $http({ url: '/userData/trackedGames',
                method: 'DELETE',
                data: {gameid: gameId},
                headers: {"Content-Type": "application/json;charset=utf-8"}
            }).then(function(res) {
                onSuccessHandler();
            }, function(error) {
                console.log(error);
            });
        },
        getTrackedGames: function(trackedGamesHanlder)
        {
            $http.get('/userdata/trackedGames').then(function(resp){
                trackedGamesHanlder(resp.data);
            });
        },
        getFriendsTrackedGames: function(friendsTrackedGamesHandler)
        {
            $http.get('/userdata/friendstrackedgames').then(function(resp)
            {
               friendsTrackedGamesHandler(resp.data);
            });
        },
        getTopTrackedGames: function(topTrackedHanler)
        {
            $http.get('/info/toptracked', {
                params: {
                    number: 8
                }
            }).then(function(resp)
            {
                topTrackedHanler(resp.data);
            });
        }
    }
});