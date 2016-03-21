/**
 * Created by Joey on 3/21/16.
 */
var app = angular.module('upcomingGames', []);

app.factory('dataService', function(){
    return {

        getTimeToRelease: function (relMon, relDay, relYear) {
            var date = new Date();
            var numSecRem = 59 - date.getSeconds();
            var numMinRem = 59 - date.getMinutes();
            var numHourRem = 23 - date.getHours();
            var numMon = relMon - date.getMonth() - 1;
            var numDay = relDay - date.getDate();
            var numYear = relYear - date.getFullYear();

            return {
                sec: numSecRem,
                min: numMinRem,
                hrs: numHourRem,
                yrs: numYear,
                days: numDay,
                mons: numMon
            }

        }
    }
});