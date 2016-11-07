var app = angular.module('upcomingGames');

app.controller('advancedsearch',function ($scope, httpReqService) {

  var vm = this;
  vm.results = "No Results...";
  vm.doSearch = function(){
      httpReqService.getAdvancedSearch("xbone", 11, 2016, [], function(data){
          vm.results = JSON.stringify(data);
      });
  }

});
