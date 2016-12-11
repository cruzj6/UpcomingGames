/**
 * Service to manage http requests to the API
 */
require('./dataManagerService.js');
var app = angular.module('upcomingGames');
app.factory('httpReqService', function ($http, $sce) {

    return {
        /**
         * Callback for searching for news articles
         * 
         * @callback ArticlesCallback
         * @param {Object[]} ArticlesData - Array of objects containing info about the resulting articles 
         */
        /**
         * Search for news articles using the UCGames API
         * 
         * @param {String} gameName
         * @param {ArticlesCallback} callback
         */
        searchForArticles: function (gameName, callback) {
            //set up our options, we send the server the game name
            var options = {
                params: {
                    gameName: gameName + "game"
                }
            };

            //Make the request, and assign the result to the newsArticles scope param
            //So that the view is updated
            $http.get('/info/articles', options).then(function (resp) {
                callback(resp.data);
            });
        },

        /**
         * Callback for searching for game media
         * 
         * @callback ArticlesCallback
         * @param {Object[]} MediaData - Array of objects containing info about the resulting media
         */
        /**
         * Search for media/videos using the UCGames API
         * 
         * @param {String} gameName
         * @param {ArticlesCallback} callback
         */
        searchForMedia: function (gameName, callback) {
            var options = {
                params: {
                    gameName: gameName + "game"
                }
            };
            //Make the request
            $http.get('/info/gameMedia', options).then(function (resp) {
                //Filter out the video id to use it for the thumbnail
                var mediaDatas = [];

                for (var i = 0; i < resp.data.length; i++) {
                    var respItem = resp.data[i];
                    var urlSplit = respItem.url.split('/');

                    //If this is a youtube video
                    if (urlSplit[2].indexOf('youtube.com') > -1) {
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
                        } ();

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
                for (var i = 0; i < mediaDatas.length; i++) {
                    $sce.trustAsResourceUrl(mediaDatas[i].url.replace("watch?v=", "embed/"));
                }
                //TODO: Other media platforms besides youtube
                callback(mediaDatas);
            });
        },

        /**
         * Callback for searching for games
         * 
         * @callback searchResultsCallback
         * @param {Game[]} results - Array of results
         */
        /**
         * Search for games using the API
         * 
         * @param {String[]} searchTerms
         * @param {searchResultsCallback} callback
         */
        searchForGames: function (searchTerms, callback) {
            var searchInValue = encodeURIComponent(searchTerms);

            //Get our promise, make the request
            var httppromise = $http.get('/info/searchgames', {
                params: {
                    //Additional data here ie->
                    searchTerm: searchInValue
                }
            });

            //When we come back assign the result to the scope parameter for results
            httppromise.then(function (res) {

                if (res.data.length > 0)
                    callback(res.data);
                else {
                    //If no results send empty instead of null
                    callback([]);
                }
            });
        },
        
        /**
         * Tell API to add a tracked game with the given ID, then callback
         * 
         * @param {String|Int} gameId
         * @callback callback
         */
        addTrackedGamePost: function (gameId, callback) {
            $http.post('/userdata/trackedGames', {
                gameid: gameId
            }).success(function () {
                callback();
            });
        },

        /**
         * Tell API to remove a tracked game with the given ID, then callback
         * 
         * @param {String|Int} gameId
         * @callback callback
         */
        removeTrackedGamePost: function (gameId, callback) {
            $http({
                url: '/userData/trackedGames',
                method: 'DELETE',
                data: { gameid: gameId },
                headers: { "Content-Type": "application/json;charset=utf-8" }
            }).then(function (res) {
                callback();
            }, function (error) {
                console.log(error);
            });
        },

        /**
         * Callback with user's tracked games
         * 
         * @callback trackedCallback
         * @param {Game[]} TrackedGames - Array of the user's tracked games as Game Items
         */
        /**
         * Tell API to get a user's tracked games then callback
         * 
         * @param {trackedCallback} callback
         */
        getTrackedGames: function (callback) {
            $http.get('/userdata/trackedGames').then(function (resp) {
                callback(resp.data);
            });
        },

        /**
         * Callback with user's friend's' games
         * 
         * @callback trackedCallback
         * @param {Object[]} FriendsTrackedGames - Array of the user's friend's tracked games
         */
        /**
         * Tell API to get a user's friend's tracked games then callback
         * 
         * @param {trackedCallback} callback
         */
        getFriendsTrackedGames: function (callback) {
            $http.get('/userdata/friendstrackedgames').then(function (resp) {
                callback(resp.data);
            });
        },

        /**
         * Callback with the most popular tracked games
         * 
         * @callback topTrackedCallback
         * @param {Game[]} TopTrackedGames - Array of the top tracked games as Game Items
         */
        /**
         * Tell API to get the top tracked games then callback
         * 
         * @param {topTrackedCallback} callback
         */
        getTopTrackedGames: function (callback) {
            $http.get('/info/toptracked', {
                params: {
                    number: 8
                }
            }).then(function (resp) {
                callback(resp.data);
            });
        },

        /**
         * Callback with the results from the advanced search
         * 
         * @callback advancedResultsCallback
         * @param {Game[]} results - Array of Game items of the advanced search results
         */
        /**
         * Get advanced search results from the API
         * 
         * @param {String} platform
         * @param {String|Int} month
         * @param {String|Int} year
         * @param {String[]} keywords
         * @param {any} callback
         */
        getAdvancedSearch: function (platform, month, year, keywords, callback) {
            console.log("making advanced search");
            $http.get('/info/advancedSearch', {
                params: {
                    platform: platform,
                    month: month,
                    year: year,
                    filters: {
                        keywords: keywords
                    }
                }
            }).then(function (res) {
                console.log("back from advanced search");
                callback(res.data);
            });
        }

    }
});
