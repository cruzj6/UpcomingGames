/**
 * Created by Joey on 8/17/16.
 */
var app = angular.module('upcomingGames');

app.directive('scroll', function($window){
return function(scope, element, attrs)
{
    var windowEl = angular.element($window);
    windowEl.on('scroll', scope.$apply.bind(scope, function(){
        var elementPos = element[0].offset().top;
        scope.scrolledTo = $window.pageYOffset >= elementPos;
    }));
}

});