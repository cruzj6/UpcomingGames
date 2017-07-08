const gameData = require('./gamedataprocessor.js');

const sendDataCallback = res => data => res.send(data);

module.exports = class GameDataController {
    /**
     * Ajax request is made here to search for games
     * {
     *  searchTerm: <string>
     * }
     * @export
     * @param {any} req
     * @param {any} res
     */
    static searchGames(req, res) {

        try {
            //Make a call to the gameData module
            gameData.searchForGameByName(req.query.searchTerm, sendDataCallback(res));
        } catch (e) {
            console.log("Error Searching for Games: " + e.message);
        }
    }

    //When request is made for news articles about a game
    static getArticles(req, res) {

        try {
            //Reqeust news article data from the gameDataProcessor
            gameData.getNewsArticleInfo(req.query.gameName, sendDataCallback(res));
        } catch (e) {
            console.log("Error getting Articles: " + e.message);
        }
    }

    //When request is made for media on the game
    static gameMedia(req, res) {

        try {
            //Request media data from gameDataProcessor, providing it the requested gameName
            gameData.getMediaData(req.query.gameName, sendDataCallback(res));
        } catch (e) {
            console.log("Error getting game Media: " + e.message);
        }
    }


    /**
     * Request a number of top tracked games
     * {
     *  number: <number>
     * }
     *
     * @static
     * @param {any} req
     * @param {any} res
     */
    static getTopTrackedGames(req, res) {

        try {
            console.log("Getting " + req.query.number + " top games");
            gameData.getTopTrackedGamesData(req.query.number, (err, topArray) => (
							err
								? res.sendStatus(500).send(err)
								: res.send(topArray)
            ));
        } catch (e) {
            console.log("Error getting top tracked games: " + e.message);
        }

    }

    /*
    {
        platform: (all, pc, xbone, ps4, wiiu, ios, android),
        fromDate: <unixTime>,
        filter: {
            keywords: []
        }
    }
     */
    static getAdvancedSearch(req, res) {

        try {
            console.log("Gettting games Coming Soon: \nRequested: " + req);
            gameData.getAdvancedSearchData(req.query, sendDataCallback(res));
        } catch (e) {
            console.log("Error performing advanced search: " + e.message);
        }
    }
};
