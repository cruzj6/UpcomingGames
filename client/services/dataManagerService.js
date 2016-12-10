/**
 * Service to manage data manipulation and processing
 */
require('../libs/countdown.min.js');
var app = angular.module('upcomingGames');
app.factory('dataService', function () {
    return {

        /**
         * Returns the amount of time until the given date based on system time
         * returns: 
         * {
         *  sec: <int>
         *  min: <int>
         *  hrs: <int>
         *  yrs: <int>
         *  days: <int>
         *  mons: <int>
         * }
         */
        getTimeToRelease: function (relMon, relDay, relYear) {
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
    }

});

function numDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}
