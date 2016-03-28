/**
 * Created by Joey on 3/21/16.
 */
require('./countdown.min.js');
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