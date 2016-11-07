var app = angular.module('upcomingGames');

app.controller('advancedsearch',function ($scope, httpReqService) {

  var vm = this;

  //Init field defaults
  vm.platform = "";
  vm.month = "";
  vm.year = "";
  vm.results = "No Results...";

  //Perform an advanced search against the API
  vm.doSearch = function(){
      httpReqService.getAdvancedSearch(vm.platform, vm.month, vm.year, [], function(data){
          vm.results = data;
      });
  }

  //Add a game to tracked games
  vm.addGame = function(gameid){
    httpReqService.addTrackedGamePost(gameid, function(){
      //TODO: Something on success?
    });
  }

});
