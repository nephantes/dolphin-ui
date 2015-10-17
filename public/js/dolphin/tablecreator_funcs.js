
function removeTableSamples(id, button){
	var table = $('#jsontable_selected_samples').dataTable();
	var row = $(button).closest('tr');
	table.fnDeleteRow(row);
	table.fnDraw();
	console.log(checklist_samples.indexOf(id));
	checklist_samples.splice(checklist_samples.indexOf(id), 1);
	removeBasketInfo(id);
}

function manageCreateChecklists(id, samplename){
	var table = $('#jsontable_selected_samples').dataTable();
	
	var run_ids = [];
	var ids = getBasketInfo().split(",");
	if (ids.indexOf(id) < 0) {
		//add
		$.ajax({ type: "GET",
				url: BASE_PATH+"/public/ajax/tablegenerator.php",
				data: { p: "getTableRuns", search: id },
				async: false,
				success : function(s)
				{
					console.log(s);
					for(var i = 0; i < s.length; i ++){
						if (run_ids[s[i].sample_id] == undefined) {
							if (s[i].run_name != null) {
								run_ids[s[i].sample_id] = [s[i].run_id, s[i].run_name, s[i].wkey];
							}
						}else{
							if (s[i].run_name != null) {
								run_ids[s[i].sample_id].push(s[i].run_id);
								run_ids[s[i].sample_id].push(s[i].run_name);
								run_ids[s[i].sample_id].push(s[i].wkey);
							}
						}
					}
				}});
		$.ajax({ type: "GET",
				url: BASE_PATH+"/public/ajax/tablegenerator.php",
				data: { p: "getTableSamples", search: id },
				async: false,
				success : function(s)
				{
					for(var i = 0; i < s.length; i++){
						var run_info = [];
						var run_select = '<select id="'+ s[i].id + '_run_select" class="form-control" onchange="reportSelection()">';
						for(var x = 0; x < run_ids[s[i].id].length; x = x+3){
							//Sample id _ Run id _ Run name
							run_select += '<option id="' + run_ids[s[i].id][x]+ '_' + run_ids[s[i].id][x+1] + '" value="'+ run_ids[s[i].id][x+2] + '">Run ' + run_ids[s[i].id][x] + ': ' + run_ids[s[i].id][x+1] + '</option>'
						}
						run_select += '</select>';
						
						table.fnAddData([
							s[i].id,
							s[i].samplename,
							run_select,
							'<button id="sample_removal_'+s[i].id+'" class="btn btn-danger btn-xs pull-right" onclick="removeTableSamples(\''+s[i].id+'\', this)"><i class=\"fa fa-times\"></i></button>'
							]);
					}
				}});
		checklist_samples.push(id);
		sendBasketInfo(id);
	}else{
		//remove
		removeTableSamples(id, document.getElementById('sample_removal_'+id));
	}
	
	reportSelection();
	
}

function reportSelection(){
	wkeys = [];
	reports = [];
	var ids = getBasketInfo().split(",");
	for(var y = 0; y < ids.length; y++){
		var option_get = $('#jsontable_selected_samples').dataTable().fnGetData();
		for(var r = 0; r < option_get.length; r++){
			var option_selected = $(option_get[r][2])[0];
			if (wkeys.indexOf(option_selected.options[option_selected.selectedIndex].value) < 0) {
				wkeys.push(option_selected.options[option_selected.selectedIndex].value);
			}
		}
	}
	console.log(wkeys);
	var wkey_count = wkeys.length;
	
	$.ajax({ type: "GET",
			url: BASE_PATH+"/public/ajax/tablegenerator.php",
			data: { p: "getTableReportsList", wkey: wkeys.toString() },
			async: false,
			success : function(s)
			{
				reports = s;
			}
	});
	
	var multi_box = document.getElementById('report_multi_box');
	multi_box.innerHTML = '';
	var run_cohesion_check = [];
	var run_cohesion_count_check = [];
	for(var y = 0; y < reports.length; y ++){
		var filename = reports[y].file.split(".")[reports[y].file.split(".").length - 1];
		if (filename != 'pdf' && filename != 'R') {
			if (run_cohesion_check.indexOf(reports[y].file) < 0) {
				run_cohesion_check.push(reports[y].file);
				run_cohesion_count_check.push(1);
				var option = document.createElement("option");
				option.id = reports[y].file;
				option.text = reports[y].file;
				if (wkey_count != run_cohesion_count_check[run_cohesion_check.indexOf(reports[y].file)]) {
					option.disabled = true;
					option.style.opacity = .35;
				}else{
					option.disabled = false;
					option.style.opacity = 1;
				}
				multi_box.add(option);
			}else{
				run_cohesion_count_check[run_cohesion_check.indexOf(reports[y].file)]++;
				if (wkey_count != run_cohesion_count_check[run_cohesion_check.indexOf(reports[y].file)]) {
					document.getElementById(reports[y].file).disabled = true;
					document.getElementById(reports[y].file).style.opacity = .35;
				}else{
					document.getElementById(reports[y].file).disabled = false;
					document.getElementById(reports[y].file).style.opacity = 1;
				}
			}
		}
	}
}

function sendToTableGen(){
	var option_get = $('#jsontable_selected_samples').dataTable().fnGetData();
	var run_array = [];
	for(var r = 0; r < option_get.length; r++){
		var option_selected = $(option_get[r][2])[0];
		var run_id = option_selected.options[option_selected.selectedIndex].id.split("_")[0]
		if (run_array[run_id] == undefined) {
			run_array[run_id] = option_get[r][0];
		}else{
			run_array[run_id] = run_array[run_id] + ',' + option_get[r][0];
		}
		
	}
	
	var run_ids = [];
	var samples_send = 'samples=';
	for(var key in run_array){
		samples_send += run_array[key] + ';' + key + ':';
		run_ids.push(key);
	}
	samples_send = samples_send.substring(0, samples_send.length - 1);
	
	var format_send = '&format=json';
	
	var files_selected = $('#report_multi_box').val();
	var file_send = '&file=' + files_selected.toString();
	
	var type_send = '';
	if (file_send.indexOf('.summary.') > -1) {
		type_send = '&type=summary';
	}

	var common_send = '';
	var key_send = '';
	var keepcols_send = '';
	if (file_send.indexOf('.counts.') > -1) {
		//counts
		common_send = '&common=id,len'
		key_send = '&key=id';
	}else if (file_send.indexOf('rsem') > -1) {
		//RSEM
		common_send = '&common=gene,transcript';
		if (file_send.indexOf('isoforms') > -1) {
			key_send = '&key=transcript';
		}else{
			key_send = '&key=gene';
		}
	}else if (file_send.indexOf('DESeq') > -1) {
		//DESEQ
		common_send = '&common=name';
		key_send = '&key=name';
		keepcols_send = '&keepcols=padj,log2FoldChange';
	}
	
	var filter_send = '';
	
	return samples_send + file_send +
		common_send + keepcols_send + key_send + type_send + format_send + filter_send;
}

function tableCreatorPage(){
	window.location.href = BASE_PATH + '/tablecreator/table/' + sendToTableGen();
}

function changeTableType(format, query){
	var json_obj;
	var beforeFormat = window.location.href.split("/table/")[1].split('format=')[0];
	$.ajax({ type: "GET",
			url: BASE_PATH+"/public/api/getsamplevals.php?" + beforeFormat + 'format=' + format,
			async: false,
			success : function(s)
			{
				json_obj = s;
			}
	});
	document.getElementById('generated_box').innerHTML = json_obj;
}

function backToTableIndex(){
	window.location.href = BASE_PATH+"/tablecreator";
}

function toBrowserPage(){
	window.location.href = BASE_PATH+'/search'
}

function toTableListing(){
	window.location.href = BASE_PATH+"/tablecreator/tablereports";
}

function rerunSelected(link) {
	window.location.href = BASE_PATH + '/tablecreator/table/' + link;
}

function saveTable() {
	var name = document.getElementById('input_table_name').value;
	var parameters;
	if (window.location.href.split("/").indexOf('table') > -1) {
		parameters = window.location.href.split("/table/")[1];
	}else{
		parameters = sendToTableGen();
	}
	var pass = false;
	$.ajax({ type: "GET",
				url: BASE_PATH+"/public/ajax/tablegenerator.php",
				data: { p: "createNewTable", search: parameters, name: name },
				async: false,
				success : function(s)
				{
					pass = true;
				}
		});
	if (pass == true) {
		toTableListing();
	}
}

function sendTableToPlot(parameters){
	//to be finished
}

function deleteTable(id){
	$.ajax({ type: "GET",
				url: BASE_PATH+"/public/ajax/tablegenerator.php",
				data: { p: "deleteTable", id: id },
				async: false,
				success : function(s)
				{
				}
		});
	location.reload();
}

$(function() {
	"use strict";
	
	if(window.location.href.split("/").indexOf('table') < 0 && window.location.href.split("/").indexOf('tablereports') < 0){
		console.log('test');
		var sample_ids = getBasketInfo();
		checklist_samples =  sample_ids.split(',');
		var runparams = $('#jsontable_selected_samples').dataTable();
		var run_ids = [];
		var samples_with_runs =[];
		
		$.ajax({ type: "GET",
				url: BASE_PATH+"/public/ajax/tablegenerator.php",
				data: { p: "getTableRuns", search: sample_ids },
				async: false,
				success : function(s)
				{
					for(var i = 0; i < s.length; i ++){
						if (run_ids[s[i].sample_id] == undefined) {
							if (s[i].run_name != null) {
								run_ids[s[i].sample_id] = [s[i].run_id, s[i].run_name, s[i].wkey];
							}
						}else{
							if (s[i].run_name != null) {
								run_ids[s[i].sample_id].push(s[i].run_id);
								run_ids[s[i].sample_id].push(s[i].run_name);
								run_ids[s[i].sample_id].push(s[i].wkey);
							}
						}
					}
				}});
		
		$.ajax({ type: "GET",
				url: BASE_PATH+"/public/ajax/tablegenerator.php",
				data: { p: "getTableSamples", search: sample_ids },
				async: false,
				success : function(s)
				{
					runparams.fnClearTable();
					for(var i = 0; i < s.length; i++){
						/*
						var checkbox = document.getElementById('sample_checkbox_'+s[i].id);
						console.log(checkbox);
						checkbox.checked = true;
						*/
						var run_info = [];
						var run_select = '<select id="'+ s[i].id + '_run_select" class="form-control" onchange="reportSelection()">';
						for(var x = 0; x < run_ids[s[i].id].length; x = x+3){
							//Sample id _ Run id _ Run name
							run_select += '<option id="' + run_ids[s[i].id][x]+ '_' + run_ids[s[i].id][x+1] + '" value="'+ run_ids[s[i].id][x+2] + '">Run ' + run_ids[s[i].id][x] + ': ' + run_ids[s[i].id][x+1] + '</option>'
						}
						run_select += '</select>';
						
						runparams.fnAddData([
							s[i].id,
							s[i].samplename,
							run_select,
							'<button id="sample_removal_'+s[i].id+'" class="btn btn-danger btn-xs pull-right" onclick="removeTableSamples(\''+s[i].id+'\', this)"><i class=\"fa fa-times\"></i></button>'
							]);
					}
				}});
		reportSelection();
	}else if (window.location.href.split("/").indexOf('table') > -1){
		var json_obj;
		var beforeFormat = window.location.href.split("/table/")[1].split('format=')[0];
		$.ajax({ type: "GET",
				url: BASE_PATH +"/public/api/getsamplevals.php?" + beforeFormat + 'format=html',
				async: false,
				success : function(s)
				{
					json_obj = s;
				}
		});
		var export_table = document.getElementById('table_export_exp_body');
		
		export_table.appendChild(createElement('textarea',['id','class','rows'],['generated_box','form-control','25']));
		document.getElementById('generated_box').innerHTML = json_obj;
		
		var div = createElement('div',[],[]);
		var dropdown = createElement('button',['id','type','class','data-toggle','aria-expanded'],['generated_button','button','margin btn btn-primary dropdown-toggle','dropdown','false']);
		dropdown.innerHTML = 'Download Type  <span class="fa fa-caret-down"></span>';
		export_table.appendChild(dropdown);
		
		var ul = createElement('ul', ['class','role'],['dropdown-menu','menu']);
		var li = '<li><a onclick="changeTableType(\'json\', \''+beforeFormat+'\')" style="cursor:pointer">JSON link</a></li>';
		li += '<li><a onclick="changeTableType(\'json2\', \''+beforeFormat+'\')" style="cursor:pointer">JSON2 link</a></li>';
		li += '<li><a onclick="changeTableType(\'html\', \''+beforeFormat+'\')" style="cursor:pointer">HTML link</a></li>';
		li += '<li><a onclick="changeTableType(\'XML\', \''+beforeFormat+'\')" style="cursor:pointer">XML link</a></li>';
		
		ul.innerHTML = li;
		div.appendChild(dropdown);
		div.appendChild(ul);
		export_table.appendChild(div);
	}else{
		var runparams = $('#jsontable_table_viewer').dataTable({
			"scrollX": true
		});
		$.ajax({ type: "GET",
				url: BASE_PATH+"/public/ajax/tablegenerator.php",
				data: { p: "getCreatedTables" },
				async: false,
				success : function(s)
				{
					runparams.fnClearTable();
					for(var x = 0; x < s.length; x++){
						var splitParameters = s[x].parameters.split('&');
						var splitSampleRuns = splitParameters[0].split('samples=')[1].split(":");
						var stringSampleRuns = '';
						console.log(splitSampleRuns);
						for(var run in splitSampleRuns){
							if (run == splitSampleRuns.length - 1) {
								stringSampleRuns += 'Run: ' + splitSampleRuns[run].split(';')[1] + ' Samples: ' + splitSampleRuns[run].split(';')[0];
							}else{
								stringSampleRuns += 'Run: ' + splitSampleRuns[run].split(';')[1] + ' Samples: ' + splitSampleRuns[run].split(';')[0] + ' | ';
							}
						}
						runparams.fnAddData([
							s[x].id,
							s[x].name,
							stringSampleRuns,
							splitParameters[1].split('file=')[1],
							'<div class="btn-group pull-right">' +
								'<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-expanded="true">Options <span class="fa fa-caret-down"></span></button>' +
								'<ul class="dropdown-menu" role="menu">' + 
									'<li><a href="" id="' + s[x].id+'" onclick="rerunSelected(\''+s[x].parameters+'\')">View</a></li>' +
									//'<li><a href="" id="' + s[x].id+'" onclick="sendTableToPlot(\''+s[x].parameters+'\')">Plot</a></li>' +
									'<li><a href="" id="' + s[x].id+'" onclick="deleteTable(this.id)">Delete</a></li>' +
								'</ul>'+
							'</div>'
						]);
					}
				}
		});
	}
});