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
		const options = {
			url,
			headers: {'Ocp-Apim-Subscription-Key': apiKey},
			qs: { q: gameName },
			json: true
		};

    return request(options).then(data => (
        console.log("RESPONSE MEDIA: ", body),
        data.value.map(result => ({
              title: result.name,
              url: result.contentUrl,
              thumbnail: result.thumbnailUrl
        	})
				)
    )).catch(err => console.log("ERROR: ", err));
}

//Request news articles from the BingAPI
export const getGameNews = gameName => {

    const url = `${rootUri}news/search`;
		const options = {
			url,
			headers: {'Ocp-Apim-Subscription-Key': apiKey},
			qs: { q: gameName }
		};

    return request(options).then(data => (
			console.log("RESPONSE NEWS: ", body),
			data.value.map(result => ({
						title: result.name,
						url: result.url,
						desc: result.description,
						date: result.datePublished
				})
			)
		)).catch(err => console.log("ERROR: ", err));
  });
}
