var app = angular.module('upcomingGames', []);
app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});

app.controller('mainCtrl', function($scope, $http){

    getTrackedGames($scope, $http);
    $scope.searchGames = function() {
        var searchInValue =  encodeURIComponent(document.getElementById('searchGamesIn').value.trim());
        var searchingText = document.getElementById('searchingIndicator');
        searchingText.style.display = 'inline-block';

        var httppromise = $http.get('/searchgames', {
            params:{
                //Additional data here ie->
                searchTerm: searchInValue
            }
        });

        httppromise.then(function(res){
            searchingText.style.display = 'none';
            $scope.searchResults = res.data;
        });
    };
    $scope.getGameInfo= function(res){
        for(var i = 0; i < $scope.trackedGames.length; i++)
        {
            $scope.trackedGames[i].curColor = 'white';
            $scope.trackedGames[i].textColor = 'black';
        }
        res.textColor = 'white';
        res.curColor = 'blue';
        searchForArticles($scope, $http, res);
        searchForMedia($scope, $http, res);
    };

    $scope.addTrackedGame = function(game)
    {
        addTrackedGamePost($scope, $http, game);
    };
});

function addTrackedGamePost($scope, $http, game)
{
    $http.post('/addTrackedGame', {
        gameid: game.gbGameId
    }).then(function(){
        getTrackedGames($scope, $http);
    });
}

function getTrackedGames($scope, $http)
{
    $http.get('/userTrackedGames').then(function(resp){
        $scope.trackedGames = resp.data;

    });
}

function searchForArticles($scope, $http, res)
{
    var options = {
        params:{
            gameName: res.name
        }
    };
    $http.get('/getArticles', options).then(function(resp){
        $scope.newsArticles = resp.data;
    });
}

function searchForMedia($scope, $http, res)
{
    var options = {
        params:{
            gameName: res.name
        }
    };
    $http.get('/gameMedia', options).then(function(resp){
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

                var mediaData = {
                    url: respItem.url,
                    title: respItem.title,
                    imgsrc: "https://img.youtube.com/vi/" + vidId + "/1.jpg"
                };
                mediaDatas.push(mediaData);
            }

        }
        //TODO: Other media platforms besides youtube
        $scope.mediaItems = mediaDatas;
    });
}

function searchForGames($scope, $http)
{
}
