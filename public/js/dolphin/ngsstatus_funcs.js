
function backToStatus(basepath){
	window.location.href = basepath + '/pipeline/status';
}

function sendToPlot(id){
	var wkey = getWKey(id);
	sendWKey(wkey);
	window.location.href = '/dolphin/plot';
}

function sendToAdvancedStatus(run_id){
	window.location.href = '/dolphin/pipeline/advstatus/' + run_id;
}

function getWKey(run_id){
	var wkey = "";
	$.ajax({ type: "GET",
			url: "/dolphin/public/ajax/ngsquerydb.php",
			data: { p: 'getWKey', run_id: run_id },
			async: false,
			success : function(s)
			{
			   wkey = s[0].wkey;
			}
	});
	return wkey;
}

function selectService(id){
	var runparams = $('#jsontable_jobs').dataTable();
	$.ajax({ type: "GET",
			 url: BASE_PATH + "/public/ajax/datajobs.php?id=" + id,
			 async: false,
			 success : function(s)
			 {
				runparams.fnClearTable();
				var parsed = JSON.parse(s);
				for(var i = 0; i < parsed.length; i++) {
					runparams.fnAddData([
						parsed[i].title,
						parsed[i].duration,
						parsed[i].job_num,
						parsed[i].submit,
						parsed[i].start,
						parsed[i].finish,
						'<button id="'+parsed[i].num+'" class="btn btn-primary btn-xs pull-right" onclick="selectJob(this.id)">Select Job</button>'
					]);
				} // End For
				document.getElementById('service_jobs').style.display = 'inline';
			}
		});
	runparams.fnSort( [ [4,'asc'] ] );
	//runparams.fnAdjustColumnSizing(true);
}

function selectJob(id){
	$.ajax({ type: "GET",
			url: BASE_PATH + "/public/ajax/datajobout.php?id=" + id,
			async: false,
			success : function(s)
			{
				var parsed = JSON.parse(s);
				joboutDataModal(parsed[0].jobname, parsed[0].jobout);
			}
		});
}

function joboutDataModal(jobname, jobout) {
   $('#joboutData').modal({
      show: true
   });
   document.getElementById('job_modal_jobname').innerHTML = jobname;
   document.getElementById('job_modal_text').innerHTML = jobout;
}

$(function() {
	"use strict";

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

	//gids
	if (gids == '') {
		gids = -1;
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
									'<li><a href="#" id="'+s[i].id+'" name="'+s[i].run_group_id+'" onClick="sendToPlot(this.id)">Generate Plots</a></li>';
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
							'<li><a href="#" id="'+s[i].id+'" name="'+s[i].run_group_id+'" onclick="rerunSelected(this.id, this.name)">Re-run with changes</a></li>' +
							'<li><a href="#" id="'+s[i].id+'" name="'+s[i].run_group_id+'" onclick="resumeSelected(this.id, this.name)">Re-run without changes</a></li>' +
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
									'<li><a href="#" id="'+s[i].id+'" name="'+s[i].run_group_id+'" onClick="sendToPlot(this.id)">Generate Plots</a></li>';
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
							'<li><a href="#" id="'+s[i].id+'" name="'+s[i].run_group_id+'" onclick="rerunSelected(this.id, this.name)">Re-run with changes</a></li>' +
							'<li><a href="#" id="'+s[i].id+'" name="'+s[i].run_group_id+'" onclick="resumeSelected(this.id, this.name)">Re-run without changes</a></li>' +
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
	//runparams.fnAdjustColumnSizing(true);
	
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
					if (parsed[i].result == 1) {
						var bartype = 'success';
						var colortype = 'green'
					}else{
						var bartype = 'danger';
						var colortype = 'red';
					}
					runparams.fnAddData([
						parsed[i].title,
						parsed[i].duration,
						'<span class="pull-right badge bg-'+colortype+'">'+parsed[i].percentComplete.split(".")[0]+'%</span>',
						'<div class="progress progress-xs"><div class="progress-bar progress-bar-'+bartype+'" style="width: '+parsed[i].percentComplete+'%"></div></div>',
						parsed[i].start,
						parsed[i].finish,
						'<button id="'+parsed[i].num+'" class="btn btn-primary btn-xs pull-right" onclick="selectService(this.id)">Select Service</button>'
					]);
				} // End For
			}
		});
		runparams.fnSort( [ [4,'asc'] ] );
		//runparams.fnAdjustColumnSizing(true);
	}
});
	
	