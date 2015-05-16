
function backToStatus(basepath){
	window.location.href = basepath + '/pipeline/status';
}

function sendToPlot(){
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