/**
 * Controller for the User Tracked Games view
 */
var app = angular.module('upcomingGames');

app.controller('usertrackedgames', function ($scope, $interval, dataService, httpReqService, trackedGamesService) {
    var vm = this;
    vm.trackedGames = [];
    //We are not in remove mode at start, set to remove games text
    vm.remToggle = false;
    vm.remStyle = "display: none";
    vm.addedGame = "";
    vm.isSearching = false;
    vm.searchQuery = "";

    /**
     * Make a call to the trackedGamesService to add a tracked game
     * 
     * @param {Game} game
     */
    vm.addTrackedGame = function (game) {
        trackedGamesService.addTrackedGame(game);
    }

    /**
     * Make a call to the trackeGamesService to update the currently selected game
     * 
     * @param {Object} $index
     * @param {Game} game
     */
    vm.selectActiveGame = function ($index, game) {
        trackedGamesService.selectActiveGame($index, game);
    }

    /**
     *  Searches for games and sets the searchResults controller property
     */
    vm.searchGames = function () {
        vm.isSearching = true;
        httpReqService.searchForGames(vm.searchQuery, function (foundGames) {
            vm.searchResults = foundGames;
            vm.isSearching = false;
        });
    };

    /**
     * Remove a tracked game from the user's tracked games
     * 
     * @param {Game} game
     */
    vm.removeTrackedGame = function (game) {
        vm.trackedGames = _.without(vm.trackedGames, game).sort(function (a, b) {
            return compareStrings(a.name, b.name);
        });
        httpReqService.removeTrackedGamePost(game.gbGameId, function () {
            $scope.$emit('trackedGamesChange', {});
        });
    };

    /**
     * Toggle for remove games mode
     */
    vm.toggleRemGames = function () {
        vm.remToggle = !vm.remToggle;
    };


    /**
     * Get the amount of time until the given date, usually the date of a game release
     * 
     * @param {Int} relMon
     * @param {Int} relDay
     * @param {Int} relYear
     * @returns {Int}
     */
    vm.getTTR = function (relMon, relDay, relYear) {
        return getTTR(relMon, relDay, relYear);
    };

    //Repeatedly update the countdown to how long is left until game release
    $interval(function () {
        for (var i = 0; i < vm.trackedGames.length; i++) {
            var trackedGame = vm.trackedGames[i];
            vm.trackedGames[i].ttr =
                dataService.getTimeToRelease(trackedGame.releaseMonth, trackedGame.releaseDay, trackedGame.releaseYear);
        }
    }, 1000);

    //When tracked games changes are posted to the server
    $scope.$on('trackedGamesChange', function (event, args) {
        vm.getTrackedGames(httpReqService);
    });

    vm.getTrackedGames = function (httpReqService) {
        vm.loadingGames = true;
        setRemoveView(vm.remToggle);
        httpReqService.getTrackedGames(function (data) {
            vm.trackedGames = data.sort(function (a, b) {
                return compareStrings(a.name, b.name);
            });

            //Remove our loading indicator
            vm.loadingGames = false;
            //Make sure view still reflects mode
            setRemoveView(vm.remToggle);
        });
    }
    //When user first enters site get their tracked games
    vm.getTrackedGames(httpReqService);

    /**
     * Toggle the search results dropdown
     */
    vm.toggleRes = function () {
        angular.element('#searchGamesButton').dropdown('toggle');
    };

    /**
     * Toggle Remove Games mode view
     * 
     * @param {Boolean} isRemove
     */
    function setRemoveView(isRemove) {
        var removeButtons = document.getElementsByName('removeGameButton');
        if (isRemove) {
            //Let user click done when they are done
            vm.remToggleText = "Done";
        }
        else {
            //Set the button text
            vm.remToggleText = "Remove Games";
        }
    }

    /**
     * Compare the alphabetical value of two string
     * 
     * @param {String} a
     * @param {String} b
     * @returns 1 if a > b, 0 if b > a
     */
    function compareStrings(a, b) {
        a = a.toLowerCase();
        b = b.toLowerCase();

        return (a < b) ? -1 : (a > b) ? 1 : 0;
    }

});
