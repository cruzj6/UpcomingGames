/**
 * Created by Joey on 4/6/16.
 */

var app = angular.module('upcomingGames');
app.controller('toptrackedgames', function($scope, httpReqService)
{
    httpReqService.getTopTrackedGames(function(topTrackedData)
    {
        $scope.topGames = topTrackedData;
    });

    $scope.showExtraTopIf = false;
    $scope.showExtraTop = false;
    $scope.showMoreTop = function()
    {
        $scope.showExtraTop = !$scope.showExtraTop;
        if($scope.showExtraTopIf) {
            angular.element('#testSlideIn')
                .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                    $scope.showExtraTopIf = false;
                });
        }
        else
        {
            $scope.showExtraTopIf = true;
        }

    }
});
