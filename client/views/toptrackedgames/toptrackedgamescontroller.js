var app = angular.module('upcomingGames');
/**
 * Controller for the Top Tracked page
 */
app.controller('toptrackedgames', function($scope, httpReqService)
{
    var vm = this;
    vm.loading = true;
    httpReqService.getTopTrackedGames(function(topTrackedData)
    {
        vm.topGames = topTrackedData;
        vm.loading = false;
    });
});
