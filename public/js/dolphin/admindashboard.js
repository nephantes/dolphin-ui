/*
 *  * Author: Alper Kucukural
 *   * Date: 4 Jan 2014
 *    * Description:
 *     *      This is a js file for the user dashboard
 *      **/

$(function() {
    "use strict";

    /* jQueryKnob */
    $(".knob").knob();

    /* Morris.js Charts */
     var responseJobs = '';
            $.ajax({ type: "GET",   
                     url: BASE_PATH+"/public/ajax/admindashboardquerydb.php",
                     data: { p: "getMonthlyJobs" },
                     async: false,
                     success : function(text)
                     {
                         responseJobs = text;
                     }
            });
    var area = new Morris.Area({
        element: 'monthly-chart',
        resize: true,
        data: responseJobs,
        xkey: 'month',
        ykeys: ['countSucess', 'countFailed'],
        labels:  ['Success', 'Failed'],
        lineColors: ['#a0d0e0', '#3c8dbc'],
        hideHover: 'auto'
    });
     var response = '';
            $.ajax({ type: "GET",   
                     url: BASE_PATH+"/public/ajax/admindashboardquerydb.php",
                     data: { p: "getMonthlyRuns" },
                     async: false,
                     success : function(text)
                     {
                         response = text;
                     }
            });
    var line = new Morris.Line({
        element: 'line-chart',
        resize: true,
        data: response,
        xkey: 'month',
        ykeys: ['countTotal'],
        labels: ['monthly total galaxy runs'],
        lineColors: ['#efefef'],
        lineWidth: 2,
        hideHover: 'auto',
        gridTextColor: "#fff",
        gridStrokeWidth: 0.4,
        pointSize: 4,
        pointStrokeColors: ["#efefef"],
        gridLineColor: "#efefef",
        gridTextFamily: "Open Sans",
        gridTextSize: 10
    });
    /*Bar chart*/
    var bar = new Morris.Bar({
        element: 'bar-chart',
        resize: true,
        data: response,
        barColors: ['#00a65a', '#f56954'],
        xkey: 'month',
        ykeys: ['countGalaxy', 'countDolphin'],
        labels: ['Galaxy Runs', 'Dolphin Runs'],
        hideHover: 'auto'
    });

});
