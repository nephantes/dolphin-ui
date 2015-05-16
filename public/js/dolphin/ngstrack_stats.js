/*
 * Author: Alper Kucukural
 * Co-Editor: Nicholas Merowsky
 * Date: 26 Nov 2014
 * Ascription:
 **/

$(function() {
	"use strict";

	//Rerun Check
	rerunLoad();

	//The Calender
	$("#calendar").datepicker();

	/*##### PAGE DETERMINER #####*/

	var qvar = "";
	var rvar = "";
	var segment = "";
	var theSearch = "";
	var uid = "";
	var gids = "";
	
	if (phpGrab) {
		var segment = phpGrab.theSegment;
		var theSearch = phpGrab.theSearch;
		uid = phpGrab.uid;
		gids = phpGrab.gids;
	}

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
		qvar = phpGrab.theField;//field
		rvar = unescape(phpGrab.theValue);//value
	}

	if (phpGrab.theField == "samples") {
		reloadBasket();
	}

	/*##### STATUS TABLE #####*/
	if (segment == 'status') {
	var runparams = $('#jsontable_runparams').dataTable();

	$.ajax({ type: "GET",
			 url: "/dolphin/public/ajax/ngsquerydb.php",
			 data: { p: "getStatus", q: qvar, r: rvar, seg: segment, search: theSearch, uid: uid, gids: gids },
			 async: false,
			 success : function(s)
			 {
				runparams.fnClearTable();
				for(var i = 0; i < s.length; i++) {
					var runstat = "";
					var disabled = '';
					if (s[i].run_status == 0) {
						runstat = '<button id="'+s[i].id+'" class="btn btn-xs disabled"><i class="fa fa-refresh">\tQueued</i></button>';
					}else if (s[i].run_status == 1) {
						runstat = '<button id="'+s[i].id+'" class="btn btn-success btn-xs"  onclick="sendToAdvancedStatus(this.id)"><i class="fa fa-check">\tComplete!</i></button>';
						disabled = '<li><a href="#" id="'+s[i].id+'" name="'+s[i].run_group_id+'" onClick="reportSelected(this.id, this.name)">Report Details</a></li>' +
									'<li><a href="#" id="'+s[i].id+'" name="'+s[i].run_group_id+'" onClick="sendToPlot()">Generate Plots</a></li>';
					}else if (s[i].run_status == 2){
						runstat = '<button id="'+s[i].id+'" class="btn btn-warning btn-xs" onclick="sendToAdvancedStatus(this.id)"><i class="fa fa-refresh">\tRunning...</i></button>';
					}else if (s[i].run_status == 3){
						runstat = '<button id="'+s[i].id+'" class="btn btn-danger btn-xs" onclick="sendToAdvancedStatus(this.id)"><i class="fa fa-warning">\tError</i></button>';
					}
					
					if (runstat != "") {
						runparams.fnAddData([
						s[i].id,
						s[i].run_name,
						s[i].outdir,
						s[i].run_description,
						runstat,
						'<div class="btn-group pull-right">' +
						'<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-expanded="true">Options <span class="fa fa-caret-down"></span></button>' +
						'</button>' +
						'<ul class="dropdown-menu" role="menu">' +
							disabled +
							'<li><a href="#" id="'+s[i].id+'" name="'+s[i].run_group_id+'" onclick="rerunSelected(this.id, this.name)">Re-run this Run</a></li>' +
							'<li class="divider"></li>' +
							'<li><a href="#" id="'+s[i].id+'" name="'+s[i].run_group_id+'" onClick="deleteRunparams(\''+s[i].id+'\')">Delete this Run</a></li>' +
						'</ul>' +
						'</div>',
						]);
					}
				} // End For
			}
		});

	$('.daterange_status').daterangepicker(
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
			 data: { p: "getStatus", q: qvar, r: rvar, seg: segment, search: theSearch, uid: uid, gids: gids, start:start.format('YYYY-MM-DD'), end:end.format('YYYY-MM-DD') },
			 async: false,
			 success : function(s)
			 {
				runparams.fnClearTable();
				for(var i = 0; i < s.length; i++) {
					var runstat = "";
					var disabled = '';
					if (s[i].run_status == 0) {
						runstat = '<button id="'+s[i].id+'" class="btn btn-xs disabled"><i class="fa fa-refresh">\tQueued</i></button>';
					}else if (s[i].run_status == 1) {
						runstat = '<button id="'+s[i].id+'" class="btn btn-success btn-xs"  onclick="sendToAdvancedStatus(this.id)"><i class="fa fa-check">\tComplete!</i></button>';
						disabled = '<li><a href="#" id="'+s[i].id+'" name="'+s[i].run_group_id+'" onClick="reportSelected(this.id, this.name)">Report Details</a></li>' +
									'<li><a href="#" id="'+s[i].id+'" name="'+s[i].run_group_id+'" onClick="sendToPlot()">Generate Plots</a></li>';
					}else if (s[i].run_status == 2){
						runstat = '<button id="'+s[i].id+'" class="btn btn-warning btn-xs" onclick="sendToAdvancedStatus(this.id)"><i class="fa fa-refresh">\tRunning...</i></button>';
					}else if (s[i].run_status == 3){
						runstat = '<button id="'+s[i].id+'" class="btn btn-danger btn-xs" onclick="sendToAdvancedStatus(this.id)"><i class="fa fa-warning">\tError</i></button>';
					}
					
					if (runstat != "") {
						runparams.fnAddData([
						s[i].id,
						s[i].run_name,
						s[i].outdir,
						s[i].run_description,
						runstat,
						'<div class="btn-group pull-right">' +
						'<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-expanded="true">Options <span class="fa fa-caret-down"></span></button>' +
						'</button>' +
						'<ul class="dropdown-menu" role="menu">' +
							disabled +
							'<li><a href="#" id="'+s[i].id+'" name="'+s[i].run_group_id+'" onclick="rerunSelected(this.id, this.name)">Re-run this Run</a></li>' +
							'<li class="divider"></li>' +
							'<li><a href="#" id="'+s[i].id+'" name="'+s[i].run_group_id+'" onClick="deleteRunparams(\''+s[i].id+'\')">Delete this Run</a></li>' +
						'</ul>' +
						'</div>',
						]);
					}
				} // End For
			 }
		});

	});

	runparams.fnSort( [ [0,'des'] ] );
	runparams.fnAdjustColumnSizing(true);
	
	}else if (segment == 'advstatus') {
	
	var wkey = getWKey(window.location.href.split("/")[window.location.href.split("/").length - 1]);
	var runparams = $('#jsontable_services').dataTable();
	console.log(wkey);
	
	$.ajax({ type: "GET",
			 url: BASE_PATH + "/public/ajax/dataservice.php?wkey=" + wkey,
			 async: false,
			 success : function(s)
			 {
				runparams.fnClearTable();
				var parsed = JSON.parse(s);
				for(var i = 0; i < parsed.length; i++) {
					runparams.fnAddData([
						parsed[i].title,
						parsed[i].duration,
						parsed[i].percentComplete,
						parsed[i].start,
						parsed[i].finish,
						'<button id="'+parsed[i].num+'" class="btn btn-primary btn-xs pull-right" onclick="selectService(this.id)">Select Service</button>'
					]);
				} // End For
			}
		});
	}


	/*##### PROTOCOLS TABLE #####*/
	
	var protocolsTable = $('#jsontable_protocols').dataTable();

	 $.ajax({ type: "GET",
					 url: "/dolphin/public/ajax/ngsquerydb.php",
					 data: { p: "getProtocols", type:"Dolphin", q: qvar, r: rvar, seg: segment, search: theSearch, uid: uid, gids: gids},
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
					 data: { p: "getProtocols", q: qvar, r: rvar, seg: segment, uid: uid, gids: gids, search: theSearch, start:start.format('YYYY-MM-DD'), end:end.format('YYYY-MM-DD') },
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

	var samplesType = "";
	if (segment == 'selected') {
		samplesType = "getSelectedSamples";
	}
	else{
		samplesType = "getSamples";
	}
	$.ajax({ type: "GET",
					 url: "/dolphin/public/ajax/ngsquerydb.php",
					 data: { p: samplesType, q: qvar, r: rvar, seg: segment, search: theSearch, uid: uid, gids: gids },
					 async: false,
					 success : function(s)
					 {
						samplesTable.fnClearTable();
						var changeHTML = '';
						var hrefSplit = window.location.href.split("/");
						var typeLocSelected = $.inArray('selected', hrefSplit);
						var typeLocRerun = $.inArray('rerun', hrefSplit);
						if (typeLocSelected > 0 || typeLocRerun > 0) {
							theSearch = '';
						}
						for(var i = 0; i < s.length; i++) {
						samplesTable.fnAddData([
						s[i].id,
			"<a href=\"/dolphin/search/details/samples/"+s[i].id+'/'+theSearch+"\">"+s[i].name+"</a>",
			s[i].title,
			s[i].source,
			s[i].organism,
			s[i].molecule,
			"<input type=\"checkbox\" class=\"ngs_checkbox\" name=\""+s[i].id+"\" id=\"sample_checkbox_"+s[i].id+"\" onClick=\"manageChecklists(this.name, 'sample_checkbox');\">",
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
					 data: { p: samplesType, q: qvar, r: rvar, seg: segment, search: theSearch, uid: uid, gids: gids, start:start.format('YYYY-MM-DD'), end:end.format('YYYY-MM-DD') },
					 async: false,
					 success : function(s)
					 {
						samplesTable.fnClearTable();
						var changeHTML = '';
						var hrefSplit = window.location.href.split("/");
						var typeLocSelected = $.inArray('selected', hrefSplit);
						var typeLocRerun = $.inArray('rerun', hrefSplit);
						if (typeLocSelected > 0 || typeLocRerun > 0) {
							theSearch = '';
						}
						for(var i = 0; i < s.length; i++) {
						samplesTable.fnAddData([
						s[i].id,
			"<a href=\"/dolphin/search/details/samples/"+s[i].id+'/'+theSearch+"\">"+s[i].title+"</a>",
			s[i].source,
			s[i].organism,
			s[i].molecule,
			"<input type=\"checkbox\" class=\"ngs_checkbox\" name=\""+s[i].id+"\" id=\"sample_checkbox_"+s[i].id+"\" onClick=\"manageChecklists(this.name, 'sample_checkbox');\">",
						]);
						} // End For
					 }
			});

	});

	samplesTable.fnSort( [ [0,'asc'] ] );
	samplesTable.fnAdjustColumnSizing(true);

	if (phpGrab.theField == "experiments") {
	checkOffAllSamples();
	reloadBasket();
	}

	/*##### LANES TABLE #####*/

	var lanesTable = $('#jsontable_lanes').dataTable();

	$.ajax({ type: "GET",
					 url: "/dolphin/public/ajax/ngsquerydb.php",
					 data: { p: "getLanes", q: qvar, r: rvar, seg: segment, search: theSearch, uid: uid, gids: gids },
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
			"<input type=\"checkbox\" class=\"ngs_checkbox\" name=\""+s[i].id+"\" id=\"lane_checkbox_"+s[i].id+"\" onClick=\"manageChecklists(this.name, 'lane_checkbox');\">",
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
					 data: { p: "getLanes", q: qvar, r: rvar, seg: segment, search: theSearch, uid: uid, gids: gids, start:start.format('YYYY-MM-DD'), end:end.format('YYYY-MM-DD') },
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
			"<input type=\"checkbox\" class=\"ngs_checkbox\" name=\""+s[i].id+"\" id=\"lane_checkbox_"+s[i].id+"\" onClick=\"manageChecklists(this.name, 'lane_checkbox');\">",
						]);
						} // End For
					 }
			});

	});

	lanesTable.fnSort( [ [0,'asc'] ] );
	lanesTable.fnAdjustColumnSizing(true);

	if (phpGrab.theField == "experiment_series") {
	checkOffAllSamples();
	checkOffAllLanes();
	reloadBasket();
	}

	/*##### SERIES TABLE #####*/

	 var experiment_seriesTable = $('#jsontable_experiment_series').dataTable();
	 $.ajax({ type: "GET",
					 url: "/dolphin/public/ajax/ngsquerydb.php",
					 data: { p: "getExperimentSeries", q: qvar, r: rvar, seg: segment, search: theSearch, uid: uid, gids: gids },
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
					 data: { p: "getExperimentSeries", q: qvar, r: rvar, seg: segment, search: theSearch, uid: uid, gids: gids, start:start.format('YYYY-MM-DD'), end:end.format('YYYY-MM-DD') },
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

	checkOffAllSamples();
	checkOffAllLanes();
	reloadBasket();
});




