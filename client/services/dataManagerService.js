/**
 * Service to manage data manipulation and processing
 */
require('../libs/countdown.min.js');
var app = angular.module('upcomingGames');
app.factory('dataService', function () {
    return {

        /**
         * An Item containing amount of time until a game releases
         * 
         * @typedef {Object} ReleaseRemTime
         * @property {Int} sec
         * @property {Int} min
         * @property {Int} hrs
         * @property {Int} yrs
         * @property {Int} days
         * @property {Int} mons
         */
        /**
         * Returns the amount of time until the given date based on system time
         * 
         * @param {ReleaseRemTime} timeToRelease
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
