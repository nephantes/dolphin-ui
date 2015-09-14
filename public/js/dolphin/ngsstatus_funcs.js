	
function backToStatus(basepath){
	window.location.href = basepath + '/stat/status';
}

function sendToPlot(id){
	var wkey = getWKey(id);
	sendWKey(wkey);
	window.location.href = BASE_PATH+'/plot';
}

function sendToAdvancedStatus(run_id){
	window.location.href = BASE_PATH+'/stat/advstatus/' + run_id;
}

function getWKey(run_id){
	var wkey = "";
	$.ajax({ type: "GET",
			url: BASE_PATH+"/public/ajax/ngsquerydb.php",
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
	service_id = id;
	var runparams = $('#jsontable_jobs').dataTable();
	$.ajax({ type: "GET",
			 url: BASE_PATH +"/ajax/datajobs.php?id=" + id,
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

function errorOutModal(run_id, wkey){
	var obtained_log;
	$.ajax({ type: "GET",
			 url: BASE_PATH +"/public/ajax/dataerrorlogs.php",
			 data: { run_id: run_id },
			 async: false,
			 success : function(s)
			 {
				obtained_log  = s
			 }
	});
	$('#logModal').modal({
      show: true
	});
	document.getElementById('logRunId').innerHTML = "run." + run_id + ".wrapper.std:";
	document.getElementById('logDetails').innerHTML = obtained_log;
	
	if (wkey == null || wkey == "null") {
		document.getElementById('modal_adv_status').style.display = "none";
	}else{
		var adv_stat_check = [];
		$.ajax({ type: "GET",
				url: BASE_PATH + "/public/ajax/dataservice.php?wkey=" + wkey,
				async: false,
				success : function(s)
				{
					adv_stat_check = s;
				}
		});
		
		if (adv_stat_check.length > 0) {
			document.getElementById('modal_adv_status').style.display = "show";
		}else{
			document.getElementById('modal_adv_status').style.display = "none";
		}
	}
   
}

function joboutDataModal(jobname, jobout) {
   $('#joboutData').modal({
      show: true
   });
   document.getElementById('job_modal_jobname').innerHTML = jobname;
   document.getElementById('job_modal_text').innerHTML = jobout;
}
	