/**
 * Causes an element to stick to the top of the page when scrolled to/passed
 */
var app = angular.module('upcomingGames');

app.directive('scroll', function ($window) {
    return function (scope, element, attrs) {
        var elementPosInitial = element.offset().top;
        var windowEl = angular.element($window);
        windowEl.on('scroll', scope.$apply.bind(scope, function () {
            scope.scrolledTo = $window.pageYOffset >= (elementPosInitial);
        }));
    }

});