/**
 * Service to interact with the user's tracked games
 */
require('../libs/countdown.min.js');
var app = angular.module('upcomingGames');
app.factory('trackedGamesService', function ($rootScope, httpReqService) {
    return {

        /**
         * When user selects a game from their tracked games list
         * 
         * @param {Object} $index
         * @param {Object} res
         */
        selectActiveGame: function ($index, res) {
            $rootScope.$broadcast('selectedGame', { index: $index, res: res });
        },

        /**
         * An Item containing data about a game, compatible with the API's game object
         * 
         * @typedef {Object} Game
         * @property {String} name - Name of the game
         * @property {String}  imageLink - Link to the image to use for the game
         * @property {String[]}  platforms - List of platforms the game is available on
         * @property {Int|String}  releaseMonth - Month the game is going to be or was released
         * @property {Int|String}  releaseYear - Year the game was/is to be released
         * @property {Int|String} releaseDay - Day the game was/is to be released
         * @property {Int|String} gbGameId - Id of the game in the giantBomb database
         */
        /**
         * Add a tracked game
         * 
         * @param {Game} game
         */
        addTrackedGame: function (game) {
            //Use giantbomb game id
            httpReqService.addTrackedGamePost(game.gbGameId, function () {
                $rootScope.$broadcast('trackedGamesChange', {});
            });
        }
    }
});