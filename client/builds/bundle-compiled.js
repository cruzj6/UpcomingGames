"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

!function (modules) {
  function __webpack_require__(moduleId) {
    if (installedModules[moduleId]) return installedModules[moduleId].exports;var module = installedModules[moduleId] = { exports: {}, id: moduleId, loaded: !1 };return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__), module.loaded = !0, module.exports;
  }var installedModules = {};return __webpack_require__.m = modules, __webpack_require__.c = installedModules, __webpack_require__.p = "", __webpack_require__(0);
}([function (module, exports, __webpack_require__) {
  function getTrackedGames($scope, httpReqService) {
    setRemoveView($scope, removeMode), httpReqService.getTrackedGames(function (data) {
      $scope.trackedGames = data.sort(function (a, b) {
        return compareStrings(a.name, b.name);
      }), angular.element("#loadingListIcon").remove(), setRemoveView($scope, removeMode);
    });
  }function setRemoveView($scope, isRemove) {
    var removeButtons = document.getElementsByName("removeGameButton");if (isRemove) {
      for (var i = 0; i < removeButtons.length; i++) {
        removeButtons[i].style.display = "inline-block";
      }$scope.remToggleText = "Done";
    } else {
      for (var j = 0; j < removeButtons.length; j++) {
        removeButtons[j].style.display = "none";
      }$scope.remToggleText = "Remove Games";
    }
  }function removeGamesToggle($scope) {
    removeMode ? (removeMode = !1, $scope.remToggle = removeMode) : (removeMode = !0, $scope.remToggle = removeMode), $scope.remStyle = removeMode ? "display: inline-block" : "display: none";
  }function ddToggle() {
    angular.element("#searchGamesButton").dropdown("toggle");
  }function compareStrings(a, b) {
    return a = a.toLowerCase(), b = b.toLowerCase(), b > a ? -1 : a > b ? 1 : 0;
  }var app = angular.module("upcomingGames", []);__webpack_require__(1);var removeMode = !1;app.config(function ($interpolateProvider, $sceDelegateProvider) {
    $interpolateProvider.startSymbol("{[{"), $interpolateProvider.endSymbol("}]}"), $sceDelegateProvider.resourceUrlWhitelist(["self", "https://www.youtube.com/**"]);
  }), app.controller("mainCtrl", function (httpReqService, dataService, $interval, $scope, $http) {
    angular.element(document).ready(function () {
      $('#news-table a[href="#1"]').tab("show");
    }), $scope.allFriends = !1, $scope.loadingNews = !1, $scope.loadingMedia = !1, $scope.trackedGames = [], $scope.friends = [], $scope.remToggle = removeMode, $scope.remStyle = "display: none", getTrackedGames($scope, httpReqService), $scope.toggleRes = function () {
      ddToggle();
    }, $scope.searchGames = function () {
      var noResText = document.getElementById("noResultsIndicator");noResText.style.display = "none";var searchInValue = document.getElementById("searchGamesIn").value.trim(),
          searchingText = document.getElementById("searchingIndicator");searchingText.style.display = "inline-block", httpReqService.searchForGames(searchInValue, function (foundGames) {
        if (searchingText.style.display = "none", foundGames.length <= 0) {
          var noResText = document.getElementById("noResultsIndicator");noResText.style.display = "inline-block";
        } else $scope.searchResults = foundGames;
      });
    }, $scope.getGameInfo = function ($index, res) {
      $scope.selectedTrackedGameIndex = $index, $scope.newsArticles = [], $scope.mediaItems = [], $scope.loadingMedia = !0, $scope.loadingNews = !0, httpReqService.searchForArticles(res.name, function (newsData) {
        $scope.loadingNews = !1, $scope.newsArticles = newsData;
      }), httpReqService.searchForMedia(res.name, function (mediaData) {
        $scope.loadingMedia = !1, $scope.mediaItems = mediaData;
      });
    }, $scope.addTrackedGame = function (game) {
      httpReqService.addTrackedGamePost(game.gbGameId, function () {
        getTrackedGames($scope, httpReqService);
      });
    }, $scope.removeTrackedGame = function (game) {
      $scope.trackedGames = _.without($scope.trackedGames, game).sort(function (a, b) {
        return compareStrings(a.name, b.name);
      }), httpReqService.removeTrackedGamePost(game.gbGameId, function () {
        getTrackedGames($scope, httpReqService);
      });
    }, $scope.toggleRemGames = function () {
      removeGamesToggle($scope);
    }, $scope.getTTR = function (relMon, relDay, relYear) {
      return getTTR(relMon, relDay, relYear);
    }, $interval(function () {
      for (var i = 0; i < $scope.trackedGames.length; i++) {
        var trackedGame = $scope.trackedGames[i];$scope.trackedGames[i].ttr = dataService.getTimeToRelease(trackedGame.releaseMonth, trackedGame.releaseDay, trackedGame.releaseYear);
      }
    }, 1e3), httpReqService.getFriendsTrackedGames(function (friendsData) {
      for (var sortedFriendsGames = friendsData, i = 0; i < sortedFriendsGames.length; i++) {
        sortedFriendsGames[i].gameData && (sortedFriendsGames[i].gameData = sortedFriendsGames[i].gameData.sort(function (a, b) {
          return compareStrings(a.name, b.name);
        }));
      }$scope.friends = sortedFriendsGames.sort(function (a, b) {
        return compareStrings(a.userid, b.userid);
      });
    }), httpReqService.getTopTrackedGames(function (topTrackedData) {
      $scope.topGames = topTrackedData;
    });
  });
}, function (module, exports, __webpack_require__) {
  __webpack_require__(2);var app = angular.module("upcomingGames");app.factory("httpReqService", function ($http, $sce) {
    return { searchForArticles: function searchForArticles(gameName, articleDataHandler) {
        var options = { params: { gameName: gameName } };$http.get("/info/getArticles", options).then(function (resp) {
          articleDataHandler(resp.data);
        });
      }, searchForMedia: function searchForMedia(gameName, mediaDataHandler) {
        var options = { params: { gameName: gameName } };$http.get("/info/gameMedia", options).then(function (resp) {
          for (var mediaDatas = [], i = 0; i < resp.data.length; i++) {
            var respItem = resp.data[i],
                urlSplit = respItem.url.split("/");if (urlSplit[2].indexOf("youtube.com") > -1) {
              var QueryItems = function () {
                for (var query_string = {}, query = respItem.url, vars = query.split("?"), i = 0; i < vars.length; i++) {
                  var pair = vars[i].split("=");if ("undefined" == typeof query_string[pair[0]]) query_string[pair[0]] = decodeURIComponent(pair[1]);else if ("string" == typeof query_string[pair[0]]) {
                    var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];query_string[pair[0]] = arr;
                  } else query_string[pair[0]].push(decodeURIComponent(pair[1]));
                }return query_string;
              }(),
                  vidId = QueryItems.v,
                  mediaData = { url: respItem.url, title: respItem.title, imgsrc: "https://img.youtube.com/vi/" + vidId + "/1.jpg" };mediaDatas.push(mediaData);
            }
          }for (var i = 0; i < mediaDatas.length; i++) {
            $sce.trustAsResourceUrl(mediaDatas[i].url.replace("watch?v=", "embed/"));
          }mediaDataHandler(mediaDatas);
        });
      }, searchForGames: function searchForGames(searchTerms, searchDataHandler) {
        var searchInValue = encodeURIComponent(searchTerms),
            httppromise = $http.get("/info/searchgames", { params: { searchTerm: searchInValue } });httppromise.then(function (res) {
          searchDataHandler(res.data.length > 0 ? res.data : []);
        });
      }, addTrackedGamePost: function addTrackedGamePost(gameId, onSuccessHandler) {
        $http.post("/userdata/addTrackedGame", { gameid: gameId }).success(function () {
          onSuccessHandler();
        });
      }, removeTrackedGamePost: function removeTrackedGamePost(gameId, onSuccessHandler) {
        $http.post("/userData/removeTrackedGame", { gameid: gameId }).success(function () {
          onSuccessHandler();
        });
      }, getTrackedGames: function getTrackedGames(trackedGamesHanlder) {
        $http.get("/userdata/userTrackedGames").then(function (resp) {
          trackedGamesHanlder(resp.data);
        });
      }, getFriendsTrackedGames: function getFriendsTrackedGames(friendsTrackedGamesHandler) {
        $http.get("/userdata/getfriendstrackedgames").then(function (resp) {
          friendsTrackedGamesHandler(resp.data);
        });
      }, getTopTrackedGames: function getTopTrackedGames(topTrackedHanler) {
        $http.get("/info/toptracked").then(function (resp) {
          topTrackedHanler(resp.data);
        });
      } };
  });
}, function (module, exports, __webpack_require__) {
  __webpack_require__(3);var app = angular.module("upcomingGames");app.factory("dataService", function () {
    return { getTimeToRelease: function getTimeToRelease(relMon, relDay, relYear) {
        var cdt = countdown(new Date(relYear, relMon, relDay));return { sec: cdt.seconds, min: cdt.minutes, hrs: cdt.hours, yrs: cdt.years, days: cdt.days, mons: cdt.months - 1 };
      } };
  });
}, function (module, exports) {
  var module;(function (v) {
    function A(a, b) {
      var c = a.getTime();return a.setMonth(a.getMonth() + b), Math.round((a.getTime() - c) / 864e5);
    }function w(a) {
      var b = a.getTime(),
          c = new Date(b);return c.setMonth(a.getMonth() + 1), Math.round((c.getTime() - b) / 864e5);
    }function x(a, b) {
      if (b = b instanceof Date || null !== b && isFinite(b) ? new Date(+b) : new Date(), !a) return b;var c = +a.value || 0;return c ? (b.setTime(b.getTime() + c), b) : ((c = +a.milliseconds || 0) && b.setMilliseconds(b.getMilliseconds() + c), (c = +a.seconds || 0) && b.setSeconds(b.getSeconds() + c), (c = +a.minutes || 0) && b.setMinutes(b.getMinutes() + c), (c = +a.hours || 0) && b.setHours(b.getHours() + c), (c = +a.weeks || 0) && (c *= 7), (c += +a.days || 0) && b.setDate(b.getDate() + c), (c = +a.months || 0) && b.setMonth(b.getMonth() + c), (c = +a.millennia || 0) && (c *= 10), (c += +a.centuries || 0) && (c *= 10), (c += +a.decades || 0) && (c *= 10), (c += +a.years || 0) && b.setFullYear(b.getFullYear() + c), b);
    }function D(a, b) {
      return y(a) + (1 === a ? p[b] : q[b]);
    }function n() {}function k(a, b, c, e, l, d) {
      if (0 <= a[c] && (b += a[c], delete a[c]), b /= l, 1 >= b + 1) return 0;if (0 <= a[e]) {
        switch (a[e] = +(a[e] + b).toFixed(d), e) {case "seconds":
            if (60 !== a.seconds || isNaN(a.minutes)) break;a.minutes++, a.seconds = 0;case "minutes":
            if (60 !== a.minutes || isNaN(a.hours)) break;a.hours++, a.minutes = 0;case "hours":
            if (24 !== a.hours || isNaN(a.days)) break;a.days++, a.hours = 0;case "days":
            if (7 !== a.days || isNaN(a.weeks)) break;a.weeks++, a.days = 0;case "weeks":
            if (a.weeks !== w(a.refMonth) / 7 || isNaN(a.months)) break;a.months++, a.weeks = 0;case "months":
            if (12 !== a.months || isNaN(a.years)) break;a.years++, a.months = 0;case "years":
            if (10 !== a.years || isNaN(a.decades)) break;a.decades++, a.years = 0;case "decades":
            if (10 !== a.decades || isNaN(a.centuries)) break;a.centuries++, a.decades = 0;case "centuries":
            if (10 !== a.centuries || isNaN(a.millennia)) break;a.millennia++, a.centuries = 0;}return 0;
      }return b;
    }function B(a, b, c, e, l, d) {
      var f = new Date();a.start = b = b || f, a.end = c = c || f, a.units = e, a.value = c.getTime() - b.getTime(), 0 > a.value && (f = c, c = b, b = f), a.refMonth = new Date(b.getFullYear(), b.getMonth(), 15, 12, 0, 0);try {
        a.millennia = 0, a.centuries = 0, a.decades = 0, a.years = c.getFullYear() - b.getFullYear(), a.months = c.getMonth() - b.getMonth(), a.weeks = 0, a.days = c.getDate() - b.getDate(), a.hours = c.getHours() - b.getHours(), a.minutes = c.getMinutes() - b.getMinutes(), a.seconds = c.getSeconds() - b.getSeconds(), a.milliseconds = c.getMilliseconds() - b.getMilliseconds();var g;for (0 > a.milliseconds ? (g = s(-a.milliseconds / 1e3), a.seconds -= g, a.milliseconds += 1e3 * g) : 1e3 <= a.milliseconds && (a.seconds += m(a.milliseconds / 1e3), a.milliseconds %= 1e3), 0 > a.seconds ? (g = s(-a.seconds / 60), a.minutes -= g, a.seconds += 60 * g) : 60 <= a.seconds && (a.minutes += m(a.seconds / 60), a.seconds %= 60), 0 > a.minutes ? (g = s(-a.minutes / 60), a.hours -= g, a.minutes += 60 * g) : 60 <= a.minutes && (a.hours += m(a.minutes / 60), a.minutes %= 60), 0 > a.hours ? (g = s(-a.hours / 24), a.days -= g, a.hours += 24 * g) : 24 <= a.hours && (a.days += m(a.hours / 24), a.hours %= 24); 0 > a.days;) {
          a.months--, a.days += A(a.refMonth, 1);
        }if (7 <= a.days && (a.weeks += m(a.days / 7), a.days %= 7), 0 > a.months ? (g = s(-a.months / 12), a.years -= g, a.months += 12 * g) : 12 <= a.months && (a.years += m(a.months / 12), a.months %= 12), 10 <= a.years && (a.decades += m(a.years / 10), a.years %= 10, 10 <= a.decades && (a.centuries += m(a.decades / 10), a.decades %= 10, 10 <= a.centuries && (a.millennia += m(a.centuries / 10), a.centuries %= 10))), b = 0, !(1024 & e) || b >= l ? (a.centuries += 10 * a.millennia, delete a.millennia) : a.millennia && b++, !(512 & e) || b >= l ? (a.decades += 10 * a.centuries, delete a.centuries) : a.centuries && b++, !(256 & e) || b >= l ? (a.years += 10 * a.decades, delete a.decades) : a.decades && b++, !(128 & e) || b >= l ? (a.months += 12 * a.years, delete a.years) : a.years && b++, !(64 & e) || b >= l ? (a.months && (a.days += A(a.refMonth, a.months)), delete a.months, 7 <= a.days && (a.weeks += m(a.days / 7), a.days %= 7)) : a.months && b++, !(32 & e) || b >= l ? (a.days += 7 * a.weeks, delete a.weeks) : a.weeks && b++, !(16 & e) || b >= l ? (a.hours += 24 * a.days, delete a.days) : a.days && b++, !(8 & e) || b >= l ? (a.minutes += 60 * a.hours, delete a.hours) : a.hours && b++, !(4 & e) || b >= l ? (a.seconds += 60 * a.minutes, delete a.minutes) : a.minutes && b++, !(2 & e) || b >= l ? (a.milliseconds += 1e3 * a.seconds, delete a.seconds) : a.seconds && b++, !(1 & e) || b >= l) {
          var h = k(a, 0, "milliseconds", "seconds", 1e3, d);if (h && (h = k(a, h, "seconds", "minutes", 60, d)) && (h = k(a, h, "minutes", "hours", 60, d)) && (h = k(a, h, "hours", "days", 24, d)) && (h = k(a, h, "days", "weeks", 7, d)) && (h = k(a, h, "weeks", "months", w(a.refMonth) / 7, d))) {
            e = h;var n,
                p = a.refMonth,
                q = p.getTime(),
                r = new Date(q);if (r.setFullYear(p.getFullYear() + 1), n = Math.round((r.getTime() - q) / 864e5), (h = k(a, e, "months", "years", n / w(a.refMonth), d)) && (h = k(a, h, "years", "decades", 10, d)) && (h = k(a, h, "decades", "centuries", 10, d)) && (h = k(a, h, "centuries", "millennia", 10, d))) throw Error("Fractional unit overflow");
          }
        }
      } finally {
        delete a.refMonth;
      }return a;
    }function d(a, b, c, e, d) {
      var f;c = +c || 222, e = e > 0 ? e : NaN, d = d > 0 ? 20 > d ? Math.round(d) : 20 : 0;var k = null;"function" == typeof a ? (f = a, a = null) : a instanceof Date || (null !== a && isFinite(a) ? a = new Date(+a) : ("object" == (typeof k === "undefined" ? "undefined" : _typeof(k)) && (k = a), a = null));var g = null;if ("function" == typeof b ? (f = b, b = null) : b instanceof Date || (null !== b && isFinite(b) ? b = new Date(+b) : ("object" == (typeof b === "undefined" ? "undefined" : _typeof(b)) && (g = b), b = null)), k && (a = x(k, b)), g && (b = x(g, a)), !a && !b) return new n();if (!f) return B(new n(), a, b, c, e, d);var h,
          k = 1 & c ? 1e3 / 30 : 2 & c ? 1e3 : 4 & c ? 6e4 : 8 & c ? 36e5 : 16 & c ? 864e5 : 6048e5,
          g = function g() {
        f(B(new n(), a, b, c, e, d), h);
      };return g(), h = setInterval(g, k);
    }var p,
        q,
        r,
        t,
        u,
        f,
        y,
        z,
        s = Math.ceil,
        m = Math.floor;n.prototype.toString = function (a) {
      var b = z(this),
          c = b.length;return c ? 1 === c ? b[0] : (a = r + b.pop(), b.join(t) + a) : a ? "" + a : u;
    }, n.prototype.toHTML = function (a, b) {
      a = a || "span";var c = z(this),
          e = c.length;if (!e) return (b = b || u) ? "<" + a + ">" + b + "</" + a + ">" : b;for (var d = 0; e > d; d++) {
        c[d] = "<" + a + ">" + c[d] + "</" + a + ">";
      }return 1 === e ? c[0] : (e = r + c.pop(), c.join(t) + e);
    }, n.prototype.addTo = function (a) {
      return x(this, a);
    }, z = function z(a) {
      var b = [],
          c = a.millennia;return c && b.push(f(c, 10)), (c = a.centuries) && b.push(f(c, 9)), (c = a.decades) && b.push(f(c, 8)), (c = a.years) && b.push(f(c, 7)), (c = a.months) && b.push(f(c, 6)), (c = a.weeks) && b.push(f(c, 5)), (c = a.days) && b.push(f(c, 4)), (c = a.hours) && b.push(f(c, 3)), (c = a.minutes) && b.push(f(c, 2)), (c = a.seconds) && b.push(f(c, 1)), (c = a.milliseconds) && b.push(f(c, 0)), b;
    }, d.MILLISECONDS = 1, d.SECONDS = 2, d.MINUTES = 4, d.HOURS = 8, d.DAYS = 16, d.WEEKS = 32, d.MONTHS = 64, d.YEARS = 128, d.DECADES = 256, d.CENTURIES = 512, d.MILLENNIA = 1024, d.DEFAULTS = 222, d.ALL = 2047;var E = d.setFormat = function (a) {
      if (a) {
        if ("singular" in a || "plural" in a) {
          var b = a.singular || [];b.split && (b = b.split("|"));var c = a.plural || [];c.split && (c = c.split("|"));for (var d = 0; 10 >= d; d++) {
            p[d] = b[d] || p[d], q[d] = c[d] || q[d];
          }
        }"string" == typeof a.last && (r = a.last), "string" == typeof a.delim && (t = a.delim), "string" == typeof a.empty && (u = a.empty), "function" == typeof a.formatNumber && (y = a.formatNumber), "function" == typeof a.formatter && (f = a.formatter);
      }
    },
        C = d.resetFormat = function () {
      p = " millisecond; second; minute; hour; day; week; month; year; decade; century; millennium".split(";"), q = " milliseconds; seconds; minutes; hours; days; weeks; months; years; decades; centuries; millennia".split(";"), r = " and ", t = ", ", u = "", y = function y(a) {
        return a;
      }, f = D;
    };return d.setLabels = function (a, b, c, d, f, k, m) {
      E({ singular: a, plural: b, last: c, delim: d, empty: f, formatNumber: k, formatter: m });
    }, d.resetLabels = C, C(), v && v.exports ? v.exports = d : "function" == typeof window.define && "undefined" != typeof window.define.amd && window.define("countdown", [], function () {
      return d;
    }), d;
  })(module);
}]);

//# sourceMappingURL=bundle-compiled.js.map