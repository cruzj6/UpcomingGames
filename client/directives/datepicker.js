/**
 * Created by Joey on 11/20/16.
 */
var app = angular.module('upcomingGames');

app.directive('datePicker', function(){
    return {
        template: "<div style='width: 20px;' class='datepicker input-group date'>" +
                                "<div class='input-group-addon'>" + 
                                    "<span class='glyphicon glyphicon-th'></span>" +
                                "</div>" +
                            "</div>",
        link:  function(scope, element, attrs)
        {
            //Modify for just month/year
            $('.datepicker').datepicker({
                 format: "mm-yyyy",
                 viewMode: "months", 
                 minViewMode: "months"
            })
            .on('changeDate', function(ev){
                    //pass day and month
                    scope.onDatePick(ev.format('mm'), ev.format('dd'));
                }
            );

            
        }
    };
});