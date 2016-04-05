'use strict';

/**
 * Created by Joey on 2/28/16.
 */
var app = angular.module('welcomePage', []);
app.config(function ($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});

app.controller('welcomePageCntrl', function ($scope, $http) {});

//# sourceMappingURL=welcomepage-compiled.js.map