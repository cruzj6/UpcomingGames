/**
 * Loaded by index.hbs,
 * rendered server side (<approot>/server/webview/index.hbs)
 */

var app = angular.module('upcomingGames', []);

require('../services/httpRequestService.js');
require('../views/usertrackedgames/usertrackedgamescontroller.js');
require('../views/tabbedcontent/tabbedcontentcontroller.js');
require('../views/toptrackedgames/toptrackedgamescontroller.js');
app.config(function($interpolateProvider, $sceDelegateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'https://www.youtube.com/**'
    ]);
});

app.controller('mainCtrl', function(httpReqService, dataService, $interval, $scope, $http){


    $scope.views = ["usrTracked", "topTracked"];
    $scope.curViewIndex = 0;
    $scope.curView = $scope.views[$scope.curViewIndex];

    //When user selects a game from their tracked games list
    $scope.selectActiveGame = function($index, res){
        $scope.$broadcast('selectedGame', {index: $index, res: res});

        //Set our item that is selected
        $scope.selectedTrackedGameIndex = $index;
    };

    //Add a tracked game
    $scope.addTrackedGame = function(game)
    {
        //Use giantbomb game id
        httpReqService.addTrackedGamePost(game.gbGameId, function(){
            $scope.$broadcast('trackedGamesChange', {});
        });
    };

    $scope.slideRight = function()
    {
        $scope.curView = $scope.views[++$scope.curViewIndex];
    };

    $scope.slideLeft = function()
    {
        $scope.curView = $scope.views[--$scope.curViewIndex];
    }


});

function compareStrings(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();

    return (a < b) ? -1 : (a > b) ? 1 : 0;
}