/**
 * This directive creates a datepicker button for selecting month/year which when selected calls the
 * supplied onDatePick attribute's function:
 * onDatePick(mon, year)
 */
var app = angular.module('upcomingGames');

app.directive('datePicker', function () {
    return {
        scope: {
            onDatePick: '&'
        },
        template: function (scope, element, attrs) {
            return "<div style='width: 200px;' class='datepicker input-group date'>" +
                "<div class='input-group-addon'>" +
                "<span class='glyphicon glyphicon-calendar'></span>" +
                "</div>" +
                "</div>";
        },
        link: function (scope, element, attrs) {
            //Modify for just month/year
            $('.datepicker').datepicker({
                format: "mm-yyyy",
                viewMode: "months",
                minViewMode: "months",
                orientation: 'bottom auto',
                autoclose: true
            })
                .on('changeDate', function (ev) {
                    var month = parseInt(ev.format('mm'));
                    var theYear = parseInt(ev.format('yyyy'));

                    //pass day and month
                    scope.$apply(scope.onDatePick({ mon: month, year: theYear }));
                });
        }
    };
});