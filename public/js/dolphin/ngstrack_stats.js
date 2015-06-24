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
	
	$('input').on('ifChanged', function(event){
		if (event.target.name.substring(0,6) == "common") {
			var array = event.target.id.split("_");
			
			if (array[1] == 'yes' && deseqList.indexOf(array[0]) == -1 && (array[0] == 'miRNA' || array[0] == 'tRNA')) {
				var selects = document.getElementsByTagName("select");
				for(var i = 0; i < selects.length; i++) {
					if(selects[i].id.indexOf('select_5_') == 0) {
						var opt = createElement('option', ['id', 'value'], [array[0], array[0]]);
						opt.innerHTML = array[0];
						selects[i].appendChild(opt);
					}
				}
				deseqList.push(array[0]);
			}else if (array[1] == 'no' && deseqList.indexOf(array[0]) > -1 ){
				deseqList.splice(deseqList.indexOf(array[0]), 1);
				var selects = document.getElementsByTagName("select");
				for(var i = 0; i < selects.length; i++) {
					if(selects[i].id.indexOf('select_5_') == 0) {
						var children = selects[i].childNodes;
						for (var y = 0; y < children.length; y++) {
							if (children[y].id.split("_")[0] == array[0]) {
								children[y].remove();
							}
						}
					}
				}
			}
		}
	});

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

	//gids
	if (gids == '') {
		gids = -1;
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
						if (s[i].total_reads >= 0 && s[i].total_reads != null) {
							samplesTable.fnAddData([
								s[i].id,
								"<a href=\"/dolphin/search/details/samples/"+s[i].id+'/'+theSearch+"\">"+s[i].name+"</a>",
								s[i].title,
								s[i].source,
								s[i].organism,
								s[i].molecule,
								"<input type=\"checkbox\" class=\"ngs_checkbox\" name=\""+s[i].id+"\" id=\"sample_checkbox_"+s[i].id+"\" onClick=\"manageChecklists(this.name, 'sample_checkbox');\">",
							]);
						}else{
							samplesTable.fnAddData([
								s[i].id,
								"<a href=\"/dolphin/search/details/samples/"+s[i].id+'/'+theSearch+"\">"+s[i].name+"</a>",
								s[i].title,
								s[i].source,
								s[i].organism,
								s[i].molecule,
								"<input type=\"checkbox\" class=\"ngs_checkbox\" name=\""+s[i].id+"\" id=\"sample_checkbox_"+s[i].id+"\" onClick=\"manageChecklists(this.name, 'sample_checkbox');\" disabled>",
							]);
						}
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
						var passedSamples = [];
						$.ajax({ type: "GET",
							url: "/dolphin/public/ajax/initialmappingdb.php",
							data: { p: 'sampleChecking', uid: uid, gids: gids},
							async: false,
							success : function(r)
							{
								for(var x = 0; x < r.length; x++){
									passedSamples.push(r[x].id);
								}
							}
						});
						for(var i = 0; i < s.length; i++) {
							if (passedSamples.indexOf(s[i].id) >= 0) {
								samplesTable.fnAddData([
									s[i].id,
									"<a href=\"/dolphin/search/details/samples/"+s[i].id+'/'+theSearch+"\">"+s[i].name+"</a>",
									s[i].title,
									s[i].source,
									s[i].organism,
									s[i].molecule,
									"<input type=\"checkbox\" class=\"ngs_checkbox\" name=\""+s[i].id+"\" id=\"sample_checkbox_"+s[i].id+"\" onClick=\"manageChecklists(this.name, 'sample_checkbox');\">",
								]);
							}else{
								samplesTable.fnAddData([
									s[i].id,
									"<a href=\"/dolphin/search/details/samples/"+s[i].id+'/'+theSearch+"\">"+s[i].name+"</a>",
									s[i].title,
									s[i].source,
									s[i].organism,
									s[i].molecule,
									"<input type=\"checkbox\" class=\"ngs_checkbox\" name=\""+s[i].id+"\" id=\"sample_checkbox_"+s[i].id+"\" onClick=\"manageChecklists(this.name, 'sample_checkbox');\" disabled>",
								]);
							}
						} // End For
				}
			});
	});

	samplesTable.fnSort( [ [0,'asc'] ] );
	//samplesTable.fnAdjustColumnSizing(true);

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
						var passedLanes = [];
						$.ajax({ type: "GET",
								url: "/dolphin/public/ajax/initialmappingdb.php",
								data: { p: 'laneChecking', uid: uid, gids: gids},
								async: false,
								success : function(r)
								{
									for (var x = 0; x < r.length; x++){
										passedLanes.push(r[x].lane_id);
									}
								}
						});
						for(var i = 0; i < s.length; i++) {
							if (passedLanes.indexOf(s[i].id) >= 0) {
								lanesTable.fnAddData([
								s[i].id,
								"<a href=\"/dolphin/search/details/experiments/"+s[i].id+'/'+theSearch+"\">"+s[i].name+"</a>",
								s[i].facility,
								s[i].total_reads,
								s[i].total_samples,
								"<input type=\"checkbox\" class=\"ngs_checkbox\" name=\""+s[i].id+"\" id=\"lane_checkbox_"+s[i].id+"\" onClick=\"manageChecklists(this.name, 'lane_checkbox');\">",	
								]);
							}else{
								lanesTable.fnAddData([
								s[i].id,
								"<a href=\"/dolphin/search/details/experiments/"+s[i].id+'/'+theSearch+"\">"+s[i].name+"</a>",
								s[i].facility,
								s[i].total_reads,
								s[i].total_samples,
								"<input type=\"checkbox\" class=\"ngs_checkbox\" name=\""+s[i].id+"\" id=\"lane_checkbox_"+s[i].id+"\" onClick=\"manageChecklists(this.name, 'lane_checkbox');\" disabled>",	
								]);
							}
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
						var passedLanes = [];
						$.ajax({ type: "GET",
								url: "/dolphin/public/ajax/initialmappingdb.php",
								data: { p: 'laneChecking', uid: uid, gids: gids},
								async: false,
								success : function(r)
								{
									for (var x = 0; x < r.length; x++){
										passedLanes.push(r[x].lane_id);
									}
								}
						});
						for(var i = 0; i < s.length; i++) {
							if (passedLanes.indexOf(s[i].id) >= 0) {
								lanesTable.fnAddData([
								s[i].id,
								"<a href=\"/dolphin/search/details/experiments/"+s[i].id+'/'+theSearch+"\">"+s[i].name+"</a>",
								s[i].facility,
								s[i].total_reads,
								s[i].total_samples,
								"<input type=\"checkbox\" class=\"ngs_checkbox\" name=\""+s[i].id+"\" id=\"lane_checkbox_"+s[i].id+"\" onClick=\"manageChecklists(this.name, 'lane_checkbox');\">",	
								]);
							}else{
								lanesTable.fnAddData([
								s[i].id,
								"<a href=\"/dolphin/search/details/experiments/"+s[i].id+'/'+theSearch+"\">"+s[i].name+"</a>",
								s[i].facility,
								s[i].total_reads,
								s[i].total_samples,
								"<input type=\"checkbox\" class=\"ngs_checkbox\" name=\""+s[i].id+"\" id=\"lane_checkbox_"+s[i].id+"\" onClick=\"manageChecklists(this.name, 'lane_checkbox');\" disabled>",	
								]);
							}
						} // End For
					 }
			});

	});

	lanesTable.fnSort( [ [0,'asc'] ] );
	//lanesTable.fnAdjustColumnSizing(true);

	if (phpGrab.theField == "experiment_series") {
	checkOffAllSamples();
	checkOffAllLanes();
	reloadBasket();
	}

	/*##### SERIES TABLE #####*/

	var experiment_seriesTable = $('#jsontable_experiment_series').dataTable({responsive: true});
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
	//experiment_seriesTable.fnAdjustColumnSizing(true);

	if (segment == 'index' || segment == 'browse' || segment == 'details') {
		checkOffAllSamples();
		checkOffAllLanes();
		reloadBasket();
	}
});




