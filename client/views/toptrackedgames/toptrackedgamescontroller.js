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

    vm.showExtraTopIf = false;
    vm.showExtraTop = false;
    vm.showMoreTop = function()
    {
        vm.showExtraTop = !vm.showExtraTop;
        if(vm.showExtraTopIf) {
            angular.element('#testSlideIn')
                .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                    vm.showExtraTopIf = false;
                });
        }
        else
        {
            vm.showExtraTopIf = true;
        }

    }
});
