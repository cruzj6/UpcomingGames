/**
 * Loaded by index.hbs,
 * rendered server side (<approot>/server/webview/index.hbs)
 */

require('../libs/ui-bootstrap-tpls-2.2.0.min.js');
var app = angular.module('upcomingGames', ["ngAnimate", "ngRoute", "ui.bootstrap"]);

require('../directives/scroll.js');
require('../directives/datepicker.js');
require('../services/httpRequestService.js');
require('../views/dashboardmain/dashboardmain.js');
require('../views/usertrackedgames/usertrackedgamescontroller.js');
require('../views/tabbedcontent/tabbedcontentcontroller.js');
require('../views/toptrackedgames/toptrackedgamescontroller.js');
require('../views/advancedsearch/advancedsearch.js');

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
        .when('/advancedsearch',{
            templateUrl: '/advancedsearch/advancedsearch.html',
            controller: 'advancedsearch',
            controllerAs: 'advancedsearch'
        })
        .otherwise({
            redirectTo: 'dashboardmain'
        });

});

app.controller('mainCtrl', function(httpReqService, dataService, $interval, $scope, $http, $timeout, $location){

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

    $scope.isActiveRoute = function(routeName) {
        return routeName == $location.path();
    }
});
