/**
 * Created by Joey on 4/4/16.
 */
var app = angular.module('upcomingGames');

app.controller('tabbedcontent', function($scope){
    //Set active inital tab
    angular.element(document).ready(function () {
        $('#news-table a[href="#1"]').tab('show');

    });
});

app.controller('newstab', function($scope, httpReqService)
{
    //Set that we are not loading news, as no games selected initially
    $scope.loadingNews = false;
    $scope.newsArticles = [];

    //When a tracked game is selected
    $scope.$on('selectedGame', function(event, args){

        //We are loading news and clear the list while we load
        $scope.newsArticles = [];
        $scope.loadingNews = true;

        //Gett the news Article data from our http service for the item
        httpReqService.searchForArticles(args.res.name, function(newsData){
            $scope.loadingNews = false;
            $scope.newsArticles = newsData;
        });
    });

});

app.controller('mediatab',function ($scope, httpReqService){

    $scope.loadingMedia = false;

    //When user selects a tracked game
    $scope.$on('selectedGame', function(event, args)
    {
        $scope.gameSelected = true;
        $scope.mediaItems = [];
        $scope.loadingMedia = true;

        //Now get media Data for the item
        httpReqService.searchForMedia(args.res.name, function(mediaData){
            $scope.loadingMedia = false;
            $scope.mediaItems = mediaData;
        });
    });

});

app.controller('friendstrackedgames', function($scope, httpReqService)
{
    //Initially don't show all friends (only ones with >0 tracked games)
    $scope.allFriends = false;
    $scope.friends = [];

    //Request tracked games from server API
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

    function compareStrings(a, b) {
        a = a.toLowerCase();
        b = b.toLowerCase();

        return (a < b) ? -1 : (a > b) ? 1 : 0;
    }
});