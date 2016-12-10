/**
 * Service to interact with the user's tracked games
 */
require('../libs/countdown.min.js');
var app = angular.module('upcomingGames');
app.factory('trackedGamesService', function ($rootScope, httpReqService) {
    return {

        //When user selects a game from their tracked games list
        selectActiveGame: function ($index, res) {
            $rootScope.$broadcast('selectedGame', { index: $index, res: res });
        },

        //Add a tracked game
        addTrackedGame: function (game) {
            //Use giantbomb game id
            httpReqService.addTrackedGamePost(game.gbGameId, function () {
                $rootScope.$broadcast('trackedGamesChange', {});
            });
        }
    }
});