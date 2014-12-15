/*
 * Author: Alper Kucukural
 * Date: 26 Nov 2014
 * Ascription:
 **/

$(function() {
    "use strict";
    



    //The Calender
    $("#calendar").datepicker();

    /*##### SERIES TABLE #####*/
	
     var experiment_seriesTable = $('#jsontable_experiment_series').dataTable(); 
     $.ajax({ type: "GET",   
                     url: "/dolphin/public/ajax/ngsquerydb.php",
                     data: { p: "getExperimentSeries" },
                     async: false,
                     success : function(s)
                     {
                        experiment_seriesTable.fnClearTable();
                        for(var i = 0; i < s.length; i++) {
                        experiment_seriesTable.fnAddData([
			s[i].id,
                        s[i].experiment_name,
                        s[i].summary,
                        s[i].design,
			s[i].username,
			s[i].id
                        ]);
                        } // End For
			for (var i=0; i<6; i++)
			{
			  var thWidth=$("#jsontable_experiment_series").find("th:eq("+i+")").width();
			  var tdWidth=$("#jsontable_experiment_series").find("td:eq("+i+")").width();      
			  if (thWidth<tdWidth)                    
			      $("#jsontable_experiment_series").find("th:eq("+i+")").width(tdWidth);
			  else
			      $("#jsontable_experiment_seriese").find("td:eq("+i+")").width(thWidth);           
			}  

                     }
            });
    
     $('.daterange_experiment_series').daterangepicker(
            {
                ranges: {
                    'Today': [moment().subtract('days', 1), moment()],
                    'Yesterday': [moment().subtract('days', 2), moment().subtract('days', 1)],
                    'Last 7 Days': [moment().subtract('days', 6), moment()],
                    'Last 30 Days': [moment().subtract('days', 29), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')],
                    'This Year': [moment().startOf('year'), moment().endOf('year')],
                },
                startDate: moment().subtract('days', 29),
                endDate: moment()
            },
    function(start, end) {
            $.ajax({ type: "GET",   
                     url: "/dolphin/public/ajax/ngsquerydb.php",
                     data: { p: "getExperimentSeries", start:start.format('YYYY-MM-DD'), end:end.format('YYYY-MM-DD') },
                     async: false,
                     success : function(s)
                     {
                        experiment_seriesTable.fnClearTable();
                        for(var i = 0; i < s.length; i++) {
                        experiment_seriesTable.fnAddData([
			s[i].id,
                        s[i].experiment_name,
                        s[i].summary,
                        s[i].design,
			s[i].username,
			s[i].id
                        ]);
                        } // End For
                     }
            });

    });
     
    experiment_seriesTable.fnSort( [ [0,'asc'] ] );

    /*##### PROTOCOLS TABLE #####*/
     
    var protocolsTable = $('#jsontable_protocols').dataTable();
     
     $.ajax({ type: "GET",   
                     url: "/dolphin/public/ajax/ngsquerydb.php",
                     data: { p: "getProtocols", type:"Dolphin" },
                     async: false,
                     success : function(s)
                     {
                        protocolsTable.fnClearTable();
                        for(var i = 0; i < s.length; i++) {
                        protocolsTable.fnAddData([
			s[i].id,
                        s[i].name,
                        s[i].growth,
			s[i].treatment,
			s[i].last_modified_user,
			s[i].id
                        ]);
                        } // End For
                     }
            });
     
    $('.daterange_protocols').daterangepicker(
            {
                ranges: {
                    'Today': [moment().subtract('days', 1), moment()],
                    'Yesterday': [moment().subtract('days', 2), moment().subtract('days', 1)],
                    'Last 7 Days': [moment().subtract('days', 6), moment()],
                    'Last 30 Days': [moment().subtract('days', 29), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')],
                    'This Year': [moment().startOf('year'), moment().endOf('year')],
                },
                startDate: moment().subtract('days', 29),
                endDate: moment()
            },
    function(start, end) {
            $.ajax({ type: "GET",   
                     url: "/dolphin/public/ajax/ngsquerydb.php",
                     data: { p: "getProtocols", start:start.format('YYYY-MM-DD'), end:end.format('YYYY-MM-DD') },
                     async: false,
                     success : function(s)
                     {
                        protocolsTable.fnClearTable();
                        for(var i = 0; i < s.length; i++) {
                        protocolsTable.fnAddData([
			s[i].id,
                        s[i].name,
                        s[i].growth,
			s[i].treatment,
			s[i].last_modified_user,
			s[i].id
                        ]);
                        } // End For
                     }
            });

    });
    protocolsTable.fnSort( [ [0,'asc'] ] );
    
    /*##### LANES TABLE #####*/
	
    var lanesTable = $('#jsontable_lanes').dataTable();
    
    $.ajax({ type: "GET",   
                     url: "/dolphin/public/ajax/ngsquerydb.php",
                     data: { p: "getLanes" },
                     async: false,
                     success : function(s)
                     {
                        lanesTable.fnClearTable();
                        for(var i = 0; i < s.length; i++) {
                        lanesTable.fnAddData([
                        s[i].id,
                        s[i].name,
			s[i].facility,
			s[i].total_reads,
			s[i].total_samples,
			s[i].id
                        ]);
                        } // End For
                    }
            });
    
    $('.daterange_lanes').daterangepicker(
            {
                ranges: {
                    'Today': [moment().subtract('days', 1), moment()],
                    'Yesterday': [moment().subtract('days', 2), moment().subtract('days', 1)],
                    'Last 7 Days': [moment().subtract('days', 6), moment()],
                    'Last 30 Days': [moment().subtract('days', 29), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')],
                    'This Year': [moment().startOf('year'), moment().endOf('year')],
                },
                startDate: moment().subtract('days', 29),
                endDate: moment()
            },
    function(start, end) {
            $.ajax({ type: "GET",   
                     url: "/dolphin/public/ajax/ngsquerydb.php",
                     data: { p: "getLanes", start:start.format('YYYY-MM-DD'), end:end.format('YYYY-MM-DD') },
                     async: false,
                     success : function(s)
                     {
                        lanesTable.fnClearTable();
                        for(var i = 0; i < s.length; i++) {
                        lanesTable.fnAddData([
                        s[i].id,
                        s[i].name,
			s[i].facility,
			s[i].total_reads,
			s[i].total_samples,
			s[i].id
                        ]);
                        } // End For
                     }
            });

    });
    
    lanesTable.fnSort( [ [0,'asc'] ] );
    
    /*##### SAMPLES TABLE #####*/
    
    var samplesTable = $('#jsontable_samples').dataTable();
    
    $.ajax({ type: "GET",   
                     url: "/dolphin/public/ajax/ngsquerydb.php",
                     data: { p: "getSamples" },
                     async: false,
                     success : function(s)
                     {
                        samplesTable.fnClearTable();
                        for(var i = 0; i < s.length; i++) {
                        samplesTable.fnAddData([
                        s[i].id,
                        s[i].title,
			s[i].source,
			s[i].organism,
			s[i].molecule,
			s[i].id
                        ]);
                        } // End For
                     }
            });
    
    $('.daterange_samples').daterangepicker(
            {
                ranges: {
                    'Today': [moment().subtract('days', 1), moment()],
                    'Yesterday': [moment().subtract('days', 2), moment().subtract('days', 1)],
                    'Last 7 Days': [moment().subtract('days', 6), moment()],
                    'Last 30 Days': [moment().subtract('days', 29), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')],
                    'This Year': [moment().startOf('year'), moment().endOf('year')],
                },
                startDate: moment().subtract('days', 29),
                endDate: moment()
            },
    function(start, end) {
            $.ajax({ type: "GET",   
                     url: "/dolphin/public/ajax/ngsquerydb.php",
                     data: { p: "getSamples", start:start.format('YYYY-MM-DD'), end:end.format('YYYY-MM-DD') },
                     async: false,
                     success : function(s)
                     {
                        samplesTable.fnClearTable();
                        for(var i = 0; i < s.length; i++) {
                        samplesTable.fnAddData([
                        s[i].id,
                        s[i].title,
			s[i].source,
			s[i].organism,
			s[i].molecule,
			s[i].id
                        ]);
                        } // End For
                     }
            });

    });
    
    samplesTable.fnSort( [ [0,'asc'] ] );
});
