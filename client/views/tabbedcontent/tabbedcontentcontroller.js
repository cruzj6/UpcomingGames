var app = angular.module('upcomingGames');
/**
 * Controller For the entire tabbed system
 */
app.controller('tabbedcontent', function ($scope) {

});

/**
 * Controller for the news tab of the tabbed content
 */
app.controller('newstab', function ($scope, httpReqService) {
    var vm = this;
    //Set that we are not loading news, as no games selected initially
    vm.loadingNews = false;
    vm.newsArticles = [];

    //When a tracked game is selected
    $scope.$on('selectedGame', function (event, args) {

        //We are loading news and clear the list while we load
        vm.newsArticles = [];
        vm.loadingNews = true;

        //Gett the news Article data from our http service for the item
        httpReqService.searchForArticles(args.res.name, function (newsData) {
            vm.loadingNews = false;
            vm.newsArticles = newsData;
        });
    });

});

/**
 * Controller for the video/media tab
 */
app.controller('mediatab', function ($scope, httpReqService) {

    var vm = this;
    vm.loadingMedia = false;

    //When user selects a tracked game
    $scope.$on('selectedGame', function (event, args) {
        vm.gameSelected = true;
        vm.mediaItems = [];
        vm.loadingMedia = true;

        //Now get media Data for the item
        httpReqService.searchForMedia(args.res.name, function (mediaData) {
            vm.loadingMedia = false;
            vm.mediaItems = mediaData;
        });
    });

});

/**
 * Controller for the Friend's tracked tab
 */
app.controller('friendstrackedgames', function ($scope, httpReqService) {
    //Initially don't show all friends (only ones with >0 tracked games)
    $scope.allFriends = false;
    $scope.friends = [];

    //Request tracked games from server API
    httpReqService.getFriendsTrackedGames(function (friendsData) {
        var sortedFriendsGames = friendsData;

        //Sort each of their games
        for (var i = 0; i < sortedFriendsGames.length; i++) {
            if (sortedFriendsGames[i].gameData) {
                sortedFriendsGames[i].gameData = sortedFriendsGames[i].gameData.sort(function (a, b) {
                    return compareStrings(a.name, b.name);
                });
            }
        }

        //Sort the friends themselves
        $scope.friends = sortedFriendsGames.sort(function (a, b) {
            return compareStrings(a.userid, b.userid);
        });
    });

    function compareStrings(a, b) {
        a = a.toLowerCase();
        b = b.toLowerCase();

        return (a < b) ? -1 : (a > b) ? 1 : 0;
    }
});