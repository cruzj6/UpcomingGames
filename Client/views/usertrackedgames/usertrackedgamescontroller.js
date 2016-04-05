/**
 * Created by Joey on 4/4/16.
 */
var app = angular.module('upcomingGames');
var removeMode = false;

app.controller('usertrackedgames', function($scope, $interval, dataService, httpReqService)
{
    $scope.trackedGames = [];
    //We are not in remove mode at start, set to remove games text
    $scope.remToggle = removeMode;
    $scope.remStyle = "display: none";

    //When user first enters site get their tracked games
    getTrackedGames($scope, httpReqService);

    //Used for form submission, if user doesn't use button
    $scope.toggleRes = function(){
        ddToggle();
    };

    //When user uses search box
    $scope.searchGames = function() {
        //Toggle our no results text if it's displaying
        var noResText = document.getElementById('noResultsIndicator');
        noResText.style.display = 'none';

        var searchInValue =  document.getElementById('searchGamesIn').value.trim();
        var searchingText = document.getElementById('searchingIndicator');
        searchingText.style.display = 'inline-block';

        httpReqService.searchForGames(searchInValue, function(foundGames){
            searchingText.style.display = 'none';

            if(foundGames.length <= 0) {
                var noResText = document.getElementById('noResultsIndicator');
                noResText.style.display = 'inline-block';
            }
            else
            {
                $scope.searchResults = foundGames;
            }
        });

    };

    $scope.removeTrackedGame = function(game){
        $scope.trackedGames = _.without($scope.trackedGames, game).sort(function(a,b)
        {
            return compareStrings(a.name, b.name);
        });
        httpReqService.removeTrackedGamePost(game.gbGameId, function(){
            getTrackedGames($scope, httpReqService);
        });
    };

    $scope.toggleRemGames = function(){
        removeGamesToggle($scope);
    };

    $scope.getTTR = function (relMon, relDay, relYear) {
        return getTTR(relMon, relDay, relYear);

    };

    //Repeatedly update the countdown to how long is left until game release
    $interval(function(){
        for(var i=0; i <$scope.trackedGames.length; i++)
        {
            var trackedGame = $scope.trackedGames[i];
            $scope.trackedGames[i].ttr =
                dataService.getTimeToRelease(trackedGame.releaseMonth, trackedGame.releaseDay, trackedGame.releaseYear);
        }
    }, 1000);

});

function getTrackedGames($scope, httpReqService)
{
    setRemoveView($scope, removeMode);
    httpReqService.getTrackedGames(function(data){
        $scope.trackedGames = data.sort(function(a,b)
        {
            return compareStrings(a.name, b.name);
        });

        //Remove our loading indicator
        angular.element("#loadingListIcon").remove();
        //Make sure view still reflects mode
        setRemoveView($scope, removeMode);

    });
}

function removeGamesToggle($scope){
    if(!removeMode) {
        removeMode = true;
        $scope.remToggle = removeMode;
    }
    else
    {
        removeMode = false;
        $scope.remToggle = removeMode;
    }
    $scope.remStyle = removeMode ? "display: inline-block" : "display: none"
}

function ddToggle(){
    //Toggle results dropdown window
    angular.element('#searchGamesButton').dropdown('toggle');
}

function compareStrings(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();

    return (a < b) ? -1 : (a > b) ? 1 : 0;
}

function setRemoveView($scope, isRemove)
{
    var removeButtons = document.getElementsByName('removeGameButton');
    if(isRemove) {
        //Make each remove button visible
        for (var i = 0; i < removeButtons.length; i++) {
            removeButtons[i].style.display = "inline-block";
        }
        //Let user click done when they are done
        $scope.remToggleText = "Done";
    }
    else
    {
        //Make each remove button in-visible
        for (var j = 0; j < removeButtons.length; j++) {
            removeButtons[j].style.display = "none";
        }
        //Set the button text
        $scope.remToggleText = "Remove Games"
    }
}