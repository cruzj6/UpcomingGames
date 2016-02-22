var app = angular.module('upcomingGames', []);
app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});

app.controller('mainCtrl', function($scope, $http){

    $scope.searchGames = function() {
        var searchInValue =  encodeURIComponent(document.getElementById('searchGamesIn').value.trim());
        var searchingText = document.getElementById('searchingIndicator');
        searchingText.style.display = 'inline-block';

        var httppromise = $http.get('/searchgames', {
            params:{
                //Additional data here ie->
                searchTerm: searchInValue
            }
        });

        httppromise.then(function(res){
            searchingText.style.display = 'none';
            $scope.searchResults = res.data;
        });
    };
    $scope.getArticles = function(res){
        searchForArticles($scope, $http, res);
    };
});

function searchForArticles($scope, $http, res)
{
    var options = {
        params:{
            gameName: res.name
        }
    };
    $http.get('/getArticles', options).then(function(resp){
        $scope.newsArticles = resp.data;
    });
}

function searchForGames($scope, $http)
{
}
