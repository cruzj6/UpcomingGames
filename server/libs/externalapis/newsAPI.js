/**
 * Created by Joey on 2/17/16.
 * Handles all requests to the BingAPI
 */
let apiKey = process.env.BING_KEY;
let rootUri = 'https://api.cognitive.microsoft.com/bing/v5.0/';
let request = require('request-promise');

//Requests media data from the Bing web API
export const getGameMedia = gameName => {
    var url = `${rootUri}videos/search`;

    //Configure options and make request
    return request({
			url,
			headers: {'Ocp-Apim-Subscription-Key': apiKey},
			qs: {
				q: gameName
			},
			json: true
		}).then(body => {
        //Init our results array we will send to callback
        console.log("RESPONSE MEDIA: ", body);
				const results = body.value;

        //Process each result into something usable for us
        const resultsArray = results.map(result => ({
              title: result.name,
              url: result.contentUrl,
              thumbnail: result.thumbnailUrl
        	})
				);

        return resultsArray;
    }).catch(err => console.log("ERROR: ", err));
}

//Request news articles from the BingAPI
export const getGameNews = (gameName, callback) => {
    //We want news
    const url = `${rootUri}news/search`;
    request({
			url,
			headers: {'Ocp-Apim-Subscription-Key': apiKey},
			qs: {
				q: gameName
			}
		}, (err, res, body) => {

        if (err) {
            console.log("ERROR: ", err);
        }
        //Init the callback response array
        console.log("RESPONSE NEWS: ", body);
        const jsonRes = JSON.parse(body);
        const results = jsonRes.value

        //Process each result into something usable for us
        const resultsArray = results.map(result => ({
              title: result.name,
              url: result.url,
              desc: result.description,
              date: result.datePublished
        	})
				);

        //Pass to callback
        callback(resultsArray);
    });
}
