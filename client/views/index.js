/**
 * Loaded by index.hbs,
 * rendered server side (<approot>/server/webview/index.hbs)
 */

require('../builds/ui-bootstrap-2.1.3.min.js');
var app = angular.module('upcomingGames', ["ngAnimate", "ngRoute", "ui.bootstrap"]);

require('../directives/scroll.js');
require('../services/httpRequestService.js');
require('../views/dashboardmain/dashboardmain.js');
require('../views/usertrackedgames/usertrackedgamescontroller.js');
require('../views/tabbedcontent/tabbedcontentcontroller.js');
require('../views/toptrackedgames/toptrackedgamescontroller.js');

app.config(function($httpProvider, $interpolateProvider, $sceDelegateProvider, $routeProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'https://www.youtube.com/**'
    ]);

    $httpProvider.defaults.headers.delete = { "Content-Type": "application/json;charset=utf-8" };

    $routeProvider
        .when('/toptrackedgames', {
            templateUrl: '/toptrackedgames/toptrackedgames.html',
            controller: 'toptrackedgames'
        })
        .when('/dashboardmain',{
            templateUrl: '/dashboardmain/dashboardmain.html',
            controller: 'dashboardmain'
        })
        .otherwise({
            redirectTo: 'dashboardmain'
        });

});

app.controller('mainCtrl', function(httpReqService, dataService, $interval, $scope, $http, $timeout){

    $scope.views = ["usrTracked", "topTracked"];
    $scope.curViewIndex = 0;
    $scope.curView = $scope.views[$scope.curViewIndex];

    //When user selects a game from their tracked games list
    $scope.selectActiveGame = function($index, res){
        $scope.$broadcast('selectedGame', {index: $index, res: res});
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
        //Trick it to disappear
        $scope.curView = -1;

        //Move in new one after anim
        $timeout(function()
        {
            $scope.curView = $scope.views[++$scope.curViewIndex];
        }, 500);
    };

    $scope.slideLeft = function()
    {
        $scope.curView = -1;
        $timeout(function()
        {
            $scope.curView = $scope.views[--$scope.curViewIndex];
        }, 500);
    };

    $scope.setSelectedView = function(index)
    {
        $scope.curViewIndex = index;
        $scope.curView = $scope.views[$scope.curViewIndex];
    };

    function compareStrings(a, b) {
        a = a.toLowerCase();
        b = b.toLowerCase();

        return (a < b) ? -1 : (a > b) ? 1 : 0;
    }

});

