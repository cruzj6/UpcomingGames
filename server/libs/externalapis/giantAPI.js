/**
 * Created by Joey on 2/16/16.
 * This module handles all requests to the GiantBomb API
 */
//require('dotenv').config();
import request from 'request';
import _ from 'underscore-node';
let apiKey = process.env.GB_KEY;
let giantBombAPI = 'http://www.giantbomb.com/api';

export const ID_XBOX = '145';
export const ID_PS4 = '146';
export const ID_WIIU = '139';
export const ID_PC = '94';
export const ID_IOS = '96';
export const ID_ANDROID = '123';
export const ID_SWITCH = '157';
export const ID_3DS = '117';

//Giantbomb API search request and filters results to just upcoming games
//and returns an object with the info we want
export function searchForGameByName(searchTerms, callback) {
    let todaysDate = new Date();

    //This will be our callback response
    let gameResponses = [];
    let jsonRes;
    let searchString = giantBombAPI + '/search/?api_key=' + apiKey +
        '&format=json' + '&query=' + searchTerms + "&resources=game";

    let qus = {
        format: 'json',
        query: searchTerms,
        resources: 'game',
        api_key: apiKey
    };

    //Make our request to the API, need custom user agent as per their API
    request.get({uri: searchString, headers: {'user-agent': 'UpcomingAwesomeGamesWoo'}}, (err, res, body) => {

        jsonRes = JSON.parse(body);

        //Results key value -> array of results
        let results = jsonRes.results;

        //For each result
        for (let i = 0; i < results.length; i++) {
            //Easier to work with
            let curResult = results[i];

            //Just need the name from each platform
            let resultsPlatforms = _.pluck(curResult.platforms, 'name');

            //Build our response object and add it to the response array
            gameResponses.push(
                generateGameDataItem(results[i].name, curResult.image, resultsPlatforms,
                    curResult.expected_release_month, curResult.expected_release_year, curResult.expected_release_day,
                    curResult.id));
        }
        //Send callback
        callback(gameResponses);
    });
}

function generateGameDataItem(itemName, itemImage, itemPlatformsArray, itemReleaseMonth, itemReleaseYear, itemReleaseDay, itemGBID) {
    return {
        name: itemName,
        imageLink: itemImage != null ? itemImage : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg",
        platforms: itemPlatformsArray,
        releaseMonth: itemReleaseMonth,
        releaseYear: itemReleaseYear,
        releaseDay: itemReleaseDay,
        gbGameId: itemGBID //We can store just this in db
    }
}

export function getDataForGameById(gameId, handleIdGameData) {
    if (gameId) {
        let queryString = giantBombAPI + "/game/" + gameId + "/?api_key=" + apiKey + '&format=json';

        console.log("QUERYING: " + queryString);

        //Make our http request to the API
        request.get({
            uri: queryString,
            headers: {'user-agent': 'UpcomingAwesomeGamesWoo'} //Required by API
        }, (err, repond, body) => {
            if (!err) {
                try {
                    let jsonRes = JSON.parse(body);

                    //Should be only one result since we are getting specific game by id not games
                    let result = jsonRes.results;

                    console.log(result.image);

                    //Format our response JSON object
                    let gameDatas = generateGameDataItem(result.name, result.image, _.pluck(result.platforms, 'name'),
                        result.expected_release_month, result.expected_release_year, result.expected_release_day, result.id);

                    //callback
                    handleIdGameData(gameDatas);
                } catch (e) {
                    handleIdGameData(null);
                }
            } else(handleIdGameData(null));
        });
    } else {
        handleIdGameData(null);
    }

}

export class AdvancedQueryBuilder {
    constructor () {
        this.query = {};
    }

    platformType (platform) {
        this.query.platform = platform;
        return this;
    }

    month (releaseMonth) {
        this.query.expected_release_month = releaseMonth;
        return this;
    }

    year (releaseYear) {
        this.query.expected_release_year = releaseYear;
        return this;
    }

    keywords (queryKeywords) {
        this.query.query = queryKeywords;
        return this;
    }

    getQuery () {
        return this.query;
    }
}

export function advancedGamesQuery(gbQuery, callback) {
    let gameResponses = [];
    let queryURI = giantBombAPI + '/games/?api_key=' + apiKey + '&filter=';

    //Tack on filters
    if (gbQuery.expected_release_month != null) {
        queryURI += 'expected_release_month:' + gbQuery.expected_release_month + ',';
    }
    if (gbQuery.expected_release_year != null) {
        queryURI += 'expected_release_year:' + gbQuery.expected_release_year + ',';
    }
    if (gbQuery.platform != null) {
        queryURI += 'platforms:' + gbQuery.platform + ',';
    }
    if (gbQuery.query != null) queryURI += 'name:' + gbQuery.query + ',';
    if (queryURI.slice(-1) === ',') queryURI = queryURI.substr(0, queryURI.length - 1);

    //Empty response ph
    let jsonRes = {};
    queryURI += '&format=json';

    //Make our request to the API, need custom user agent as per their API
    console.log("Making Request to GB API: " + queryURI);
    request.get({uri: queryURI, headers: {'user-agent': 'UpcomingAwesomeGamesWoo'}}, (err, res, body) => {

        if (!err) {
            jsonRes = JSON.parse(body);
            let apiGamesResponse = [];
            let gbResults = jsonRes.results;
            console.log("Giant Bomb Response: " + jsonRes);

            //Format our results to comply with game-info API
            for (let i = 0; i < gbResults.length; i++) {
                let gbResult = gbResults[i];
                apiGamesResponse.push(generateGameDataItem(gbResult.name, gbResult.image, _.pluck(gbResult.platforms, 'name'),
                    gbResult.expected_release_month, gbResult.expected_release_year, gbResult.expected_release_day, gbResult.id));
            }
            callback(apiGamesResponse);
        } else {
            console.log("Error querying Giant Bomb API: " + err);
            callback({});
        }
    });
}
