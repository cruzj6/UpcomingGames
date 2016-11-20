var app = angular.module('upcomingGames');

app.controller('advancedsearch',function ($scope, httpReqService) {

  var vm = this;
  var curYear = new Date().getFullYear();
  var curMonth = new Date().getMonth();
  //Init field defaults
  vm.platform = "";
  vm.month = curMonth;
  vm.year = curYear; 
  vm.results = "No Results...";
  vm.monthOptions= [1,2,3,4,5,6,7,8,9,10,11,12];
  vm.yearOptions = [];
  vm.isResults = false;
  vm.isLoadingResults = false;

  //Fill pickable years
  var firstYear = 1980;
  var lastYear = 2050;
  for(var year = firstYear; year < lastYear; year++)
  {
    vm.yearOptions.push(year);
  }

  //Perform an advanced search against the API
  vm.doSearch = function(){
      vm.isLoadingResults = true;
      httpReqService.getAdvancedSearch(vm.platform, vm.month, vm.year, [], function(data){
          vm.results = data;
          vm.isResults = vm.results.length > 0;
          vm.isLoadingResults = false;
      });
  }

  //Add a game to tracked games
  vm.addGame = function(gameid){
    httpReqService.addTrackedGamePost(gameid, function(){
        //Emit event that we changed tracked games
        $scope.$emit('trackedGamesChange', {});
    });
  }

  vm.onDatePicked = function(mon, year){
    alert(mon + "" + year);
    vm.month = mon;
    vm.year = year;
  }
});
