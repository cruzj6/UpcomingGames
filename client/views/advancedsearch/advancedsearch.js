var app = angular.module('upcomingGames');

/**
 * Controller for the Advanced Search view
 */
app.controller('advancedsearch', function ($scope, httpReqService) {

  var vm = this;
  var curYear = new Date().getFullYear();
  var curMonth = new Date().getMonth();
  //Init field defaults
  vm.platform = "";
  vm.month = curMonth;
  vm.year = curYear;
  vm.results = "No Results...";
  vm.monthOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  vm.yearOptions = [];
  vm.isResults = false;
  vm.isLoadingResults = false;
  vm.keywords = "";

  //Fill pickable years
  var firstYear = 1980;
  var lastYear = 2050;
  for (var year = firstYear; year < lastYear; year++) {
    vm.yearOptions.push(year);
  }

  /**
   * Perform an advanced search against the API
   */
  vm.doSearch = function () {
    vm.isLoadingResults = true;
    httpReqService.getAdvancedSearch(vm.platform, vm.month, vm.year, vm.keywords, function (data) {
      vm.results = data;
      vm.isResults = vm.results.length > 0;
      vm.isLoadingResults = false;
    });
  }

  /**
   * Add a game to tracked games
   * 
   * @param {Int} gameid
   */
  vm.addGame = function (gameid) {
    httpReqService.addTrackedGamePost(gameid, function () {
      //Emit event that we changed tracked games
      $scope.$emit('trackedGamesChange', {});
    });
  }

  /**
   * Change month and year parameters when the date is chosen
   * 
   * @param {Int} mon
   * @param {Int} year
   */
  vm.onDatePicked = function (mon, year) {
    vm.month = mon;
    vm.year = year;
  }
});
