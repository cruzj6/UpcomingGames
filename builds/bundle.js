/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var app = angular.module('upcomingGames', []);

	__webpack_require__(1);
	var removeMode = false;

	app.config(function($interpolateProvider, $sceDelegateProvider) {
	    $interpolateProvider.startSymbol('{[{');
	    $interpolateProvider.endSymbol('}]}');
	    $sceDelegateProvider.resourceUrlWhitelist([
	        'self',
	        'https://www.youtube.com/**'
	    ]);
	});

	app.controller('mainCtrl', function(httpReqService, dataService, $interval, $scope, $http){

	    angular.element(document).ready(function () {
	        $('#news-table a[href="#1"]').tab('show');

	    });
	    $scope.allFriends = false;
	    $scope.loadingNews = false;
	    $scope.loadingMedia = false;

	    $scope.trackedGames = [];
	    $scope.friends = [];

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

	    //When user selects a game from their tracked games list
	    $scope.getGameInfo= function($index, res){
	        //Set our item that is selected
	        $scope.selectedTrackedGameIndex = $index;
	        $scope.newsArticles = [];
	        $scope.mediaItems = [];
	        $scope.loadingMedia = true;
	        $scope.loadingNews = true;

	        //Gett the news Article data from our http service for the item
	        httpReqService.searchForArticles(res.name, function(newsData){
	            $scope.loadingNews = false;
	            $scope.newsArticles = newsData;
	            $scope.$apply();
	        });

	        //Now get media Data for the item
	        httpReqService.searchForMedia(res.name, function(mediaData){
	            $scope.loadingMedia = false;
	            $scope.mediaItems = mediaData;
	            $scope.$apply();
	        });

	    };

	    $scope.addTrackedGame = function(game)
	    {
	        //Use giantbomb game id
	        httpReqService.addTrackedGamePost(game.gbGameId, function(){
	            getTrackedGames($scope, httpReqService);
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

	    httpReqService.getFriendsTrackedGames(function(friendsData)
	    {
	        var sortedFriendsGames = friendsData;

	        //Sort each of their games
	        for(var i=0; i<sortedFriendsGames.length;i++)
	        {
	            if(sortedFriendsGames[i].gameData) {
	                sortedFriendsGames[i].gameData = sortedFriendsGames[i].gameData.sort(function (a, b) {
	                    return compareStrings(a.name, b.name);
	                });
	            }
	        }

	        //Sort the friends themselves
	        $scope.friends = sortedFriendsGames.sort(function(a,b)
	        {
	            return compareStrings(a.userid, b.userid);
	        });
	    });
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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Joey on 3/21/16.
	 */
	__webpack_require__(2);
	var app = angular.module('upcomingGames');
	app.factory('httpReqService', function($http, $sce){
	    return{
	        searchForArticles: function(gameName, articleDataHandler)
	        {
	            //set up our options, we send the server the game name
	            var options = {
	                params:{
	                    gameName: gameName
	                }
	            };

	            //Make the request, and assign the result to the newsArticles scope param
	            //So that the view is updated
	            $http.get('/info/getArticles', options).then(function(resp){
	                articleDataHandler(resp.data);
	            });
	        },

	        searchForMedia: function(gameName, mediaDataHandler)
	        {
	            var options = {
	                params:{
	                    gameName: gameName
	                }
	            };
	            //Make the request
	            $http.get('/info/gameMedia', options).then(function(resp){
	                //Filter out the video id to use it for the thumbnail
	                var mediaDatas = [];

	                for(var i = 0; i < resp.data.length; i++) {
	                    var respItem = resp.data[i];
	                    var urlSplit = respItem.url.split('/');

	                    //If this is a youtube video
	                    if(urlSplit[2].indexOf('youtube.com') > -1) {
	                        var QueryItems = function () {
	                            var query_string = {};
	                            var query = respItem.url;
	                            var vars = query.split("?");
	                            for (var i = 0; i < vars.length; i++) {
	                                var pair = vars[i].split("=");
	                                // If first entry with this name
	                                if (typeof query_string[pair[0]] === "undefined") {
	                                    query_string[pair[0]] = decodeURIComponent(pair[1]);
	                                    // If second entry with this name
	                                } else if (typeof query_string[pair[0]] === "string") {
	                                    var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
	                                    query_string[pair[0]] = arr;
	                                    // If third or later entry with this name
	                                } else {
	                                    query_string[pair[0]].push(decodeURIComponent(pair[1]));
	                                }
	                            }
	                            return query_string;
	                        }();

	                        //Get the v parameter which is the youtube video id
	                        var vidId = QueryItems.v;

	                        //Set up a custom object with the data and add it to the returned JSON array
	                        var mediaData = {
	                            url: respItem.url,
	                            title: respItem.title,
	                            imgsrc: "https://img.youtube.com/vi/" + vidId + "/1.jpg"
	                        };
	                        mediaDatas.push(mediaData);
	                    }

	                }
	                for(var i=0; i< mediaDatas.length; i++)
	                {
	                    $sce.trustAsResourceUrl(mediaDatas[i].url.replace("watch?v=", "embed/"));
	                }
	                //TODO: Other media platforms besides youtube
	                mediaDataHandler(mediaDatas);
	            });
	        },

	        searchForGames: function(searchTerms, searchDataHandler)
	        {
	            var searchInValue = encodeURIComponent(searchTerms);

	            //Get our promise, make the request
	            var httppromise = $http.get('/info/searchgames', {
	                params:{
	                    //Additional data here ie->
	                    searchTerm: searchInValue
	                }
	            });

	            //When we come back assign the result to the scope parameter for results
	            httppromise.then(function(res){

	                if(res.data.length > 0)
	                    searchDataHandler(res.data);
	                else {
	                    //If no results send empty instead of null
	                    searchDataHandler([]);
	                }
	            });
	        },
	        addTrackedGamePost: function(gameId, onSuccessHandler)
	        {
	            $http.post('/userdata/addTrackedGame', {
	                gameid: gameId
	            }).success(function(){
	                onSuccessHandler();
	            });
	        },
	        removeTrackedGamePost: function (gameId, onSuccessHandler)
	        {
	            $http.post('/userData/removeTrackedGame',{
	                gameid: gameId
	            }).success(function(){
	                onSuccessHandler();
	            });
	        },
	        getTrackedGames: function(trackedGamesHanlder)
	        {
	            $http.get('/userdata/userTrackedGames').then(function(resp){
	                trackedGamesHanlder(resp.data);
	            });
	        },
	        getFriendsTrackedGames: function(friendsTrackedGamesHandler)
	        {
	            $http.get('/info/getfriendstrackedgames').then(function(resp)
	            {
	               friendsTrackedGamesHandler(resp.data);
	            });
	        }
	    }
	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Joey on 3/21/16.
	 */
	__webpack_require__(3);
	var app = angular.module('upcomingGames');
	app.factory('dataService', function(){
	    return {

	        getTimeToRelease: function(relMon, relDay, relYear)
	        {
	            var cdt = countdown(new Date(relYear, relMon, relDay));
	            return {
	                sec: cdt.seconds,
	                min: cdt.minutes,
	                hrs: cdt.hours,
	                yrs: cdt.years,
	                days: cdt.days,
	                mons: cdt.months - 1
	            };
	        }

	        /*getTimeToRelease: function (relMon, relDay, relYear) {
	            var date = new Date();
	            var numSecRem = 59 - date.getSeconds();
	            var numMinRem = 59 - date.getMinutes();
	            var numHourRem = 23 - date.getHours();
	            var numMon = relMon - date.getMonth() - 1;

	            var remDaysThisMonth = numDaysInMonth(date.getMonth(), date.getYear()) - date.getDate();
	            var numDay = 0;
	            if(relMon != date.getMonth)
	                numDay = remDaysThisMonth + relDay - 1;
	            else
	                numDay = relDay - 1;

	            var numYear = relYear - date.getFullYear();

	            return {
	                sec: numSecRem,
	                min: numMinRem,
	                hrs: numHourRem,
	                yrs: numYear,
	                days: numDay,
	                mons: numMon
	            }

	        }*/
	    }

	});

	function numDaysInMonth(month, year)
	{
	    return new Date(year, month, 0).getDate();
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
	 countdown.js v2.6.0 http://countdownjs.org
	 Copyright (c)2006-2014 Stephen M. McKamey.
	 Licensed under The MIT License.
	*/
	var module,countdown=function(v){function A(a,b){var c=a.getTime();a.setMonth(a.getMonth()+b);return Math.round((a.getTime()-c)/864E5)}function w(a){var b=a.getTime(),c=new Date(b);c.setMonth(a.getMonth()+1);return Math.round((c.getTime()-b)/864E5)}function x(a,b){b=b instanceof Date||null!==b&&isFinite(b)?new Date(+b):new Date;if(!a)return b;var c=+a.value||0;if(c)return b.setTime(b.getTime()+c),b;(c=+a.milliseconds||0)&&b.setMilliseconds(b.getMilliseconds()+c);(c=+a.seconds||0)&&b.setSeconds(b.getSeconds()+
	c);(c=+a.minutes||0)&&b.setMinutes(b.getMinutes()+c);(c=+a.hours||0)&&b.setHours(b.getHours()+c);(c=+a.weeks||0)&&(c*=7);(c+=+a.days||0)&&b.setDate(b.getDate()+c);(c=+a.months||0)&&b.setMonth(b.getMonth()+c);(c=+a.millennia||0)&&(c*=10);(c+=+a.centuries||0)&&(c*=10);(c+=+a.decades||0)&&(c*=10);(c+=+a.years||0)&&b.setFullYear(b.getFullYear()+c);return b}function D(a,b){return y(a)+(1===a?p[b]:q[b])}function n(){}function k(a,b,c,e,l,d){0<=a[c]&&(b+=a[c],delete a[c]);b/=l;if(1>=b+1)return 0;if(0<=a[e]){a[e]=
	+(a[e]+b).toFixed(d);switch(e){case "seconds":if(60!==a.seconds||isNaN(a.minutes))break;a.minutes++;a.seconds=0;case "minutes":if(60!==a.minutes||isNaN(a.hours))break;a.hours++;a.minutes=0;case "hours":if(24!==a.hours||isNaN(a.days))break;a.days++;a.hours=0;case "days":if(7!==a.days||isNaN(a.weeks))break;a.weeks++;a.days=0;case "weeks":if(a.weeks!==w(a.refMonth)/7||isNaN(a.months))break;a.months++;a.weeks=0;case "months":if(12!==a.months||isNaN(a.years))break;a.years++;a.months=0;case "years":if(10!==
	a.years||isNaN(a.decades))break;a.decades++;a.years=0;case "decades":if(10!==a.decades||isNaN(a.centuries))break;a.centuries++;a.decades=0;case "centuries":if(10!==a.centuries||isNaN(a.millennia))break;a.millennia++;a.centuries=0}return 0}return b}function B(a,b,c,e,l,d){var f=new Date;a.start=b=b||f;a.end=c=c||f;a.units=e;a.value=c.getTime()-b.getTime();0>a.value&&(f=c,c=b,b=f);a.refMonth=new Date(b.getFullYear(),b.getMonth(),15,12,0,0);try{a.millennia=0;a.centuries=0;a.decades=0;a.years=c.getFullYear()-
	b.getFullYear();a.months=c.getMonth()-b.getMonth();a.weeks=0;a.days=c.getDate()-b.getDate();a.hours=c.getHours()-b.getHours();a.minutes=c.getMinutes()-b.getMinutes();a.seconds=c.getSeconds()-b.getSeconds();a.milliseconds=c.getMilliseconds()-b.getMilliseconds();var g;0>a.milliseconds?(g=s(-a.milliseconds/1E3),a.seconds-=g,a.milliseconds+=1E3*g):1E3<=a.milliseconds&&(a.seconds+=m(a.milliseconds/1E3),a.milliseconds%=1E3);0>a.seconds?(g=s(-a.seconds/60),a.minutes-=g,a.seconds+=60*g):60<=a.seconds&&(a.minutes+=
	m(a.seconds/60),a.seconds%=60);0>a.minutes?(g=s(-a.minutes/60),a.hours-=g,a.minutes+=60*g):60<=a.minutes&&(a.hours+=m(a.minutes/60),a.minutes%=60);0>a.hours?(g=s(-a.hours/24),a.days-=g,a.hours+=24*g):24<=a.hours&&(a.days+=m(a.hours/24),a.hours%=24);for(;0>a.days;)a.months--,a.days+=A(a.refMonth,1);7<=a.days&&(a.weeks+=m(a.days/7),a.days%=7);0>a.months?(g=s(-a.months/12),a.years-=g,a.months+=12*g):12<=a.months&&(a.years+=m(a.months/12),a.months%=12);10<=a.years&&(a.decades+=m(a.years/10),a.years%=
	10,10<=a.decades&&(a.centuries+=m(a.decades/10),a.decades%=10,10<=a.centuries&&(a.millennia+=m(a.centuries/10),a.centuries%=10)));b=0;!(e&1024)||b>=l?(a.centuries+=10*a.millennia,delete a.millennia):a.millennia&&b++;!(e&512)||b>=l?(a.decades+=10*a.centuries,delete a.centuries):a.centuries&&b++;!(e&256)||b>=l?(a.years+=10*a.decades,delete a.decades):a.decades&&b++;!(e&128)||b>=l?(a.months+=12*a.years,delete a.years):a.years&&b++;!(e&64)||b>=l?(a.months&&(a.days+=A(a.refMonth,a.months)),delete a.months,
	7<=a.days&&(a.weeks+=m(a.days/7),a.days%=7)):a.months&&b++;!(e&32)||b>=l?(a.days+=7*a.weeks,delete a.weeks):a.weeks&&b++;!(e&16)||b>=l?(a.hours+=24*a.days,delete a.days):a.days&&b++;!(e&8)||b>=l?(a.minutes+=60*a.hours,delete a.hours):a.hours&&b++;!(e&4)||b>=l?(a.seconds+=60*a.minutes,delete a.minutes):a.minutes&&b++;!(e&2)||b>=l?(a.milliseconds+=1E3*a.seconds,delete a.seconds):a.seconds&&b++;if(!(e&1)||b>=l){var h=k(a,0,"milliseconds","seconds",1E3,d);if(h&&(h=k(a,h,"seconds","minutes",60,d))&&(h=
	k(a,h,"minutes","hours",60,d))&&(h=k(a,h,"hours","days",24,d))&&(h=k(a,h,"days","weeks",7,d))&&(h=k(a,h,"weeks","months",w(a.refMonth)/7,d))){e=h;var n,p=a.refMonth,q=p.getTime(),r=new Date(q);r.setFullYear(p.getFullYear()+1);n=Math.round((r.getTime()-q)/864E5);if(h=k(a,e,"months","years",n/w(a.refMonth),d))if(h=k(a,h,"years","decades",10,d))if(h=k(a,h,"decades","centuries",10,d))if(h=k(a,h,"centuries","millennia",10,d))throw Error("Fractional unit overflow");}}}finally{delete a.refMonth}return a}
	function d(a,b,c,e,d){var f;c=+c||222;e=0<e?e:NaN;d=0<d?20>d?Math.round(d):20:0;var k=null;"function"===typeof a?(f=a,a=null):a instanceof Date||(null!==a&&isFinite(a)?a=new Date(+a):("object"===typeof k&&(k=a),a=null));var g=null;"function"===typeof b?(f=b,b=null):b instanceof Date||(null!==b&&isFinite(b)?b=new Date(+b):("object"===typeof b&&(g=b),b=null));k&&(a=x(k,b));g&&(b=x(g,a));if(!a&&!b)return new n;if(!f)return B(new n,a,b,c,e,d);var k=c&1?1E3/30:c&2?1E3:c&4?6E4:c&8?36E5:c&16?864E5:6048E5,
	h,g=function(){f(B(new n,a,b,c,e,d),h)};g();return h=setInterval(g,k)}var s=Math.ceil,m=Math.floor,p,q,r,t,u,f,y,z;n.prototype.toString=function(a){var b=z(this),c=b.length;if(!c)return a?""+a:u;if(1===c)return b[0];a=r+b.pop();return b.join(t)+a};n.prototype.toHTML=function(a,b){a=a||"span";var c=z(this),e=c.length;if(!e)return(b=b||u)?"\x3c"+a+"\x3e"+b+"\x3c/"+a+"\x3e":b;for(var d=0;d<e;d++)c[d]="\x3c"+a+"\x3e"+c[d]+"\x3c/"+a+"\x3e";if(1===e)return c[0];e=r+c.pop();return c.join(t)+e};n.prototype.addTo=
	function(a){return x(this,a)};z=function(a){var b=[],c=a.millennia;c&&b.push(f(c,10));(c=a.centuries)&&b.push(f(c,9));(c=a.decades)&&b.push(f(c,8));(c=a.years)&&b.push(f(c,7));(c=a.months)&&b.push(f(c,6));(c=a.weeks)&&b.push(f(c,5));(c=a.days)&&b.push(f(c,4));(c=a.hours)&&b.push(f(c,3));(c=a.minutes)&&b.push(f(c,2));(c=a.seconds)&&b.push(f(c,1));(c=a.milliseconds)&&b.push(f(c,0));return b};d.MILLISECONDS=1;d.SECONDS=2;d.MINUTES=4;d.HOURS=8;d.DAYS=16;d.WEEKS=32;d.MONTHS=64;d.YEARS=128;d.DECADES=256;
	d.CENTURIES=512;d.MILLENNIA=1024;d.DEFAULTS=222;d.ALL=2047;var E=d.setFormat=function(a){if(a){if("singular"in a||"plural"in a){var b=a.singular||[];b.split&&(b=b.split("|"));var c=a.plural||[];c.split&&(c=c.split("|"));for(var d=0;10>=d;d++)p[d]=b[d]||p[d],q[d]=c[d]||q[d]}"string"===typeof a.last&&(r=a.last);"string"===typeof a.delim&&(t=a.delim);"string"===typeof a.empty&&(u=a.empty);"function"===typeof a.formatNumber&&(y=a.formatNumber);"function"===typeof a.formatter&&(f=a.formatter)}},C=d.resetFormat=
	function(){p=" millisecond; second; minute; hour; day; week; month; year; decade; century; millennium".split(";");q=" milliseconds; seconds; minutes; hours; days; weeks; months; years; decades; centuries; millennia".split(";");r=" and ";t=", ";u="";y=function(a){return a};f=D};d.setLabels=function(a,b,c,d,f,k,m){E({singular:a,plural:b,last:c,delim:d,empty:f,formatNumber:k,formatter:m})};d.resetLabels=C;C();v&&v.exports?v.exports=d:"function"===typeof window.define&&"undefined"!==typeof window.define.amd&&
	window.define("countdown",[],function(){return d});return d}(module);

/***/ }
/******/ ]);