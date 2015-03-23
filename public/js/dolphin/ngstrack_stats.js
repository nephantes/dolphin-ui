/*
 * Author: Alper Kucukural
 * Co-Editor: Nicholas Merowsky
 * Date: 26 Nov 2014
 * Ascription:
 **/

$(function() {
    "use strict";
    
    //The Calender
    $("#calendar").datepicker();

    /*##### PAGE DETERMINER #####*/

    var segment = phpGrab.theSegment;
    var qvar = ""
    var rvar = "";
    var theSearch = phpGrab.theSearch;
    
    //Details values
    if (segment == "details") {
	if (phpGrab.theField == "experiment_series") {
	    qvar = phpGrab.theValue;
	}
	else if (phpGrab.theField == "experiments") {
	    rvar = phpGrab.theValue;
	}
    }
    
    //Browse values
    else if (segment == "browse") {
	qvar = phpGrab.theField;  //field
	rvar = unescape(phpGrab.theValue);  //value
    }
    
    /*##### PROTOCOLS TABLE #####*/
     
    var protocolsTable = $('#jsontable_protocols').dataTable();
     
     $.ajax({ type: "GET",   
                     url: "/dolphin/public/ajax/ngsquerydb.php",
                     data: { p: "getProtocols", type:"Dolphin", q: qvar, r: rvar, seg: segment, search: theSearch},
                     async: false,
                     success : function(s)
                     {
                        protocolsTable.fnClearTable();
                        for(var i = 0; i < s.length; i++) {
                        protocolsTable.fnAddData([
			s[i].id,
			"<a href=\"/dolphin/search/details/protocols/"+s[i].id+'/'+theSearch+"\">"+s[i].name+"</a>", 
                        s[i].growth,
			s[i].treatment,
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
                     data: { p: "getProtocols", q: qvar, r: rvar, seg: segment, search: theSearch, start:start.format('YYYY-MM-DD'), end:end.format('YYYY-MM-DD') },
                     async: false,
                     success : function(s)
                     {
                        protocolsTable.fnClearTable();
                        for(var i = 0; i < s.length; i++) {
                        protocolsTable.fnAddData([
			s[i].id,
			"<a href=\"/dolphin/search/details/protocols/"+s[i].id+'/'+theSearch+"\">"+s[i].name+"</a>", 
                        s[i].growth,
			s[i].treatment,
                        ]);
                        } // End For
                     }
            });

    });
    protocolsTable.fnSort( [ [0,'asc'] ] );
    //protocolsTable.fnAdjustColumnSizing(true);
    
    
    
    /*##### SAMPLES TABLE #####*/
    
    var samplesTable = $('#jsontable_samples').dataTable();
    
    $.ajax({ type: "GET",   
                     url: "/dolphin/public/ajax/ngsquerydb.php",
                     data: { p: "getSamples", q: qvar, r: rvar, seg: segment, search: theSearch },
                     async: false,
                     success : function(s)
                     {
                        samplesTable.fnClearTable();
                        for(var i = 0; i < s.length; i++) {
                        samplesTable.fnAddData([
                        s[i].id,
			"<a href=\"/dolphin/search/details/samples/"+s[i].id+'/'+theSearch+"\">"+s[i].title+"</a>", 
			s[i].source,
			s[i].organism,
			s[i].molecule,
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
                     data: { p: "getSamples", q: qvar, r: rvar, seg: segment, search: theSearch, start:start.format('YYYY-MM-DD'), end:end.format('YYYY-MM-DD') },
                     async: false,
                     success : function(s)
                     {
                        samplesTable.fnClearTable();
                        for(var i = 0; i < s.length; i++) {
                        samplesTable.fnAddData([
                        s[i].id,
			"<a href=\"/dolphin/search/details/samples/"+s[i].id+'/'+theSearch+"\">"+s[i].title+"</a>", 
			s[i].source,
			s[i].organism,
			s[i].molecule,
                        ]);
                        } // End For
                     }
            });

    });
    
    samplesTable.fnSort( [ [0,'asc'] ] );
    samplesTable.fnAdjustColumnSizing(true);
    
    /*##### LANES TABLE #####*/
	
    var lanesTable = $('#jsontable_lanes').dataTable();
    
    $.ajax({ type: "GET",   
                     url: "/dolphin/public/ajax/ngsquerydb.php",
                     data: { p: "getLanes", q: qvar, r: rvar, seg: segment, search: theSearch },
                     async: false,
                     success : function(s)
                     {
                        lanesTable.fnClearTable();
                        for(var i = 0; i < s.length; i++) {
                        lanesTable.fnAddData([
                        s[i].id,
			"<a href=\"/dolphin/search/details/experiments/"+s[i].id+'/'+theSearch+"\">"+s[i].name+"</a>", 
			s[i].facility,
			s[i].total_reads,
			s[i].total_samples,
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
                     data: { p: "getLanes", q: qvar, r: rvar, seg: segment, search: theSearch, start:start.format('YYYY-MM-DD'), end:end.format('YYYY-MM-DD') },
                     async: false,
                     success : function(s)
                     {
                        lanesTable.fnClearTable();
                        for(var i = 0; i < s.length; i++) {
                        lanesTable.fnAddData([
                        s[i].id,
			"<a href=\"/dolphin/search/details/experiments/"+s[i].id+'/'+theSearch+"\">"+s[i].name+"</a>", 
			s[i].facility,
			s[i].total_reads,
			s[i].total_samples,
                        ]);
                        } // End For
                     }
            });

    });
    
    lanesTable.fnSort( [ [0,'asc'] ] );
    lanesTable.fnAdjustColumnSizing(true);
    
    /*##### SERIES TABLE #####*/
	
     var experiment_seriesTable = $('#jsontable_experiment_series').dataTable(); 
     $.ajax({ type: "GET",   
                     url: "/dolphin/public/ajax/ngsquerydb.php",
                     data: { p: "getExperimentSeries", q: qvar, r: rvar, seg: segment, search: theSearch },
                     async: false,
                     success : function(s)
                     {
                        experiment_seriesTable.fnClearTable();
                        for(var i = 0; i < s.length; i++) {
                        experiment_seriesTable.fnAddData([
			s[i].id,
			"<a href=\"/dolphin/search/details/experiment_series/"+s[i].id+'/'+theSearch+"\">"+s[i].experiment_name+"</a>", 
                        s[i].summary,
                        s[i].design,
                        ]);
                        } // End For
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
                     data: { p: "getExperimentSeries", q: qvar, r: rvar, seg: segment, search: theSearch, start:start.format('YYYY-MM-DD'), end:end.format('YYYY-MM-DD') },
                     async: false,
                     success : function(s)
                     {
                        experiment_seriesTable.fnClearTable();
                        for(var i = 0; i < s.length; i++) {
                        experiment_seriesTable.fnAddData([
			s[i].id,
			"<a href=\"/dolphin/search/details/experiment_series/"+s[i].id+'/'+theSearch+"\">"+s[i].experiment_name+"</a>", 
                        s[i].summary,
                        s[i].design,
                        ]);
                        } // End For
                     }
            });

    });
     
    experiment_seriesTable.fnSort( [ [0,'asc'] ] );
    experiment_seriesTable.fnAdjustColumnSizing(true);
    
});




