var app = angular.module('upcomingGames', []);

require('./httpRequestService.js');
var removeMode = false;

app.config(function($interpolateProvider, $sceDelegateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'https://www.youtube.com/**'
    ]);
});

app.controller('mainCtrl', function(httpReqService, dataService, $interval, $scope, $http){

    angular.element(document).ready(function () {
        $('#news-table a[href="#1"]').tab('show');

    });
    $scope.allFriends = false;
    $scope.loadingNews = false;
    $scope.loadingMedia = false;

    $scope.trackedGames = [];
    $scope.friends = [];

    //We are not in remove mode at start, set to remove games text
    $scope.remToggle = removeMode;
    $scope.remStyle = "display: none";

    //When user first enters site get their tracked games
    getTrackedGames($scope, httpReqService);

    //Used for form submission, if user doesn't use button
    $scope.toggleRes = function(){
        ddToggle();
    };

    //When user uses search box
    $scope.searchGames = function() {
        //Toggle our no results text if it's displaying
        var noResText = document.getElementById('noResultsIndicator');
        noResText.style.display = 'none';

        var searchInValue =  document.getElementById('searchGamesIn').value.trim();
        var searchingText = document.getElementById('searchingIndicator');
        searchingText.style.display = 'inline-block';

        httpReqService.searchForGames(searchInValue, function(foundGames){
            searchingText.style.display = 'none';

            if(foundGames.length <= 0) {
                var noResText = document.getElementById('noResultsIndicator');
                noResText.style.display = 'inline-block';
            }
            else
            {
                $scope.searchResults = foundGames;
            }
        });

    };

    //When user selects a game from their tracked games list
    $scope.getGameInfo= function($index, res){
        //Set our item that is selected
        $scope.selectedTrackedGameIndex = $index;
        $scope.newsArticles = [];
        $scope.mediaItems = [];
        $scope.loadingMedia = true;
        $scope.loadingNews = true;

        //Gett the news Article data from our http service for the item
        httpReqService.searchForArticles(res.name, function(newsData){
            $scope.loadingNews = false;
            $scope.newsArticles = newsData;
            //$scope.$apply();
        });

        //Now get media Data for the item
        httpReqService.searchForMedia(res.name, function(mediaData){
            $scope.loadingMedia = false;
            $scope.mediaItems = mediaData;
           // $scope.$apply();
        });

    };

    $scope.addTrackedGame = function(game)
    {
        //Use giantbomb game id
        httpReqService.addTrackedGamePost(game.gbGameId, function(){
            getTrackedGames($scope, httpReqService);
        });
    };

    $scope.removeTrackedGame = function(game){
        $scope.trackedGames = _.without($scope.trackedGames, game).sort(function(a,b)
        {
            return compareStrings(a.name, b.name);
        });
        httpReqService.removeTrackedGamePost(game.gbGameId, function(){
            getTrackedGames($scope, httpReqService);
        });
    };

    $scope.toggleRemGames = function(){
        removeGamesToggle($scope);
    };

    $scope.getTTR = function (relMon, relDay, relYear) {
            return getTTR(relMon, relDay, relYear);

    };

    //Repeatedly update the countdown to how long is left until game release
    $interval(function(){
        for(var i=0; i <$scope.trackedGames.length; i++)
        {
            var trackedGame = $scope.trackedGames[i];
            $scope.trackedGames[i].ttr =
                dataService.getTimeToRelease(trackedGame.releaseMonth, trackedGame.releaseDay, trackedGame.releaseYear);
        }
    }, 1000);

    httpReqService.getFriendsTrackedGames(function(friendsData)
    {
        var sortedFriendsGames = friendsData;

        //Sort each of their games
        for(var i=0; i<sortedFriendsGames.length;i++)
        {
            if(sortedFriendsGames[i].gameData) {
                sortedFriendsGames[i].gameData = sortedFriendsGames[i].gameData.sort(function (a, b) {
                    return compareStrings(a.name, b.name);
                });
            }
        }

        //Sort the friends themselves
        $scope.friends = sortedFriendsGames.sort(function(a,b)
        {
            return compareStrings(a.userid, b.userid);
        });
    });

    httpReqService.getTopTrackedGames(function(topTrackedData)
    {
        $scope.topGames = topTrackedData;
    });
});

function getTrackedGames($scope, httpReqService)
{
    setRemoveView($scope, removeMode);
    httpReqService.getTrackedGames(function(data){
        $scope.trackedGames = data.sort(function(a,b)
        {
            return compareStrings(a.name, b.name);
        });

        //Remove our loading indicator
        angular.element("#loadingListIcon").remove();
        //Make sure view still reflects mode
        setRemoveView($scope, removeMode);

    });
}

function setRemoveView($scope, isRemove)
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

function compareStrings(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();

    return (a < b) ? -1 : (a > b) ? 1 : 0;
}