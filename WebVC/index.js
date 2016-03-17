var app = angular.module('upcomingGames', []);
var removeMode = false;

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});

app.controller('mainCtrl', function($scope, $http){

    //We are not in remove mode at start, set to remove games text
    $scope.remToggle = removeMode;
    $scope.remStyle = "display: none";

    //When user first enters site get their tracked games
    getTrackedGames($scope, $http);

    //Used for form submission, if user doesn't use button
    $scope.toggleRes = function(){
        ddToggle();
    };

    //When user uses search box
    $scope.searchGames = function() {
        //Toggle our no results text if it's displaying
        var noResText = document.getElementById('noResultsIndicator');
        noResText.style.display = 'none';

        //Encode the spaces in the search text
        var searchInValue =  encodeURIComponent(document.getElementById('searchGamesIn').value.trim());
        var searchingText = document.getElementById('searchingIndicator');
        searchingText.style.display = 'inline-block';

        //Get our promise, make the request
        var httppromise = $http.get('/info/searchgames', {
            params:{
                //Additional data here ie->
                searchTerm: searchInValue
            }
        });

        //When we come back assign the result to the scope parameter for results
        httppromise.then(function(res){
            searchingText.style.display = 'none';
            if(res.data.length > 0)
                $scope.searchResults = res.data;
            else {
                //If no results show our no results text
                $scope.searchResults = [];
                var noResText = document.getElementById('noResultsIndicator');
                noResText.style.display = 'inline-block';
            }
        });
    };

    //When user selects a game from their tracked games list
    $scope.getGameInfo= function(res){

        //We set the color of the selected item and de-color the others
        for(var i = 0; i < $scope.trackedGames.length; i++)
        {
            $scope.trackedGames[i].curColor = 'white';
            $scope.trackedGames[i].textColor = 'black';
        }
        res.textColor = 'white';
        res.curColor = 'darkslategray';
        searchForArticles($scope, $http, res);
        searchForMedia($scope, $http, res);
    };

    $scope.addTrackedGame = function(game)
    {
        addTrackedGamePost($scope, $http, game);
    };

    $scope.removeTrackedGame = function(game){
      removeTrackedGamePost($scope, $http, game);
    };

    $scope.toggleRemGames = function(){
        removeGamesToggle($scope);
    };
    $scope.getTTR = function (relMon, relDay, relYear) {
        return getTTR(relMon, relDay, relYear);
    }
});

function removeTrackedGamePost($scope, $http, game)
{
    $http.post('/userData/removeTrackedGame',{
        gameid: game.gbGameId
    }).success(function(){
        getTrackedGames($scope, $http);
    });
}

function addTrackedGamePost($scope, $http, game)
{
    $http.post('/userdata/addTrackedGame', {
        gameid: game.gbGameId
    }).success(function(){
        getTrackedGames($scope, $http);
    });
}

function getTrackedGames($scope, $http)
{
    $http.get('/userdata/userTrackedGames').then(function(resp){
        $scope.trackedGames = resp.data;

        //Make sure view still reflects mode
        setRemoveView($scope, removeMode);
    });
}

function searchForArticles($scope, $http, res)
{
    //set up our options, we send the server the game name
    var options = {
        params:{
            gameName: res.name
        }
    };
    //Make the request, and assign the result to the newsArticles scope param
    //So that the view is updated
    $http.get('/info/getArticles', options).then(function(resp){
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
        //TODO: Other media platforms besides youtube
        $scope.mediaItems = mediaDatas;
    });
}

function  setRemoveView($scope, isRemove)
{
    var removeButtons = document.getElementsByName('removeGameButton');
    if(isRemove) {
        //Make each remove button visible
        for (var i = 0; i < removeButtons.length; i++) {
            removeButtons[i].style.display = "inline-block";
        }
        //Let user click done when they are done
        $scope.remToggleText = "Done";
    }
    else
    {
        //Make each remove button in-visible
        for (var j = 0; j < removeButtons.length; j++) {
            removeButtons[j].style.display = "none";
        }
        //Set the button text
        $scope.remToggleText = "Remove Games"
    }
}

function removeGamesToggle($scope){
    if(!removeMode) {
        removeMode = true;
        $scope.remToggle = removeMode;
    }
    else
    {
        removeMode = false;
        $scope.remToggle = removeMode;
    }
    $scope.remStyle = removeMode ? "display: inline-block" : "display: none"
}

function ddToggle(){
    //Toggle results dropdown window
    angular.element('#searchGamesButton').dropdown('toggle');
}

function getTTR(relMon, relDay, relYear)
{
    var date = new Date();
    var numSecRem = 59 - date.getSeconds();
    var numMinRem = 59 - date.getMinutes();
    var numHourRem = 23 - date.getHours();
    var numMon = relMon - date.getMonth();
    var numDay = relDay - date.getDay();
    var numYear = relYear - date.getFullYear();


    return{
        sec: numSecRem,
        min: numMinRem,
        hrs: numHourRem,
        yrs: numYear,
        days: numDay,
        mons: numMon
    }
}