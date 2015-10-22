var selectionHelper = [];
var runHelper = [];

function removeTableSamples(id, button){
	var table = $('#jsontable_selected_samples').dataTable();
	var row = $(button).closest('tr');
	table.fnDeleteRow(row);
	table.fnDraw();
	checklist_samples.splice(checklist_samples.indexOf(id), 1);
	selectionHelper.splice(runHelper.indexOf(id), 1);
	runHelper.splice(runHelper.indexOf(id), 1);
	checkCheckedList();
	removeBasketInfo(id);
	reportSelection();
	document.getElementById('sample_checkbox_'+id).checked = false;
}

function manageCreateChecklists(id, tablerow){
	var table = $('#jsontable_selected_samples').dataTable();
	
	var run_ids = [];
	var ids = [];
	if (getBasketInfo() != undefined) {
		ids = getBasketInfo().split(",");
	}
	if (ids.indexOf(id) < 0) {
		//add
		$.ajax({ type: "GET",
				url: BASE_PATH+"/public/ajax/tablegenerator.php",
				data: { p: "getTableRuns", search: id },
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
				data: { p: "getTableSamples", search: id },
				async: false,
				success : function(s)
				{
					for(var i = 0; i < s.length; i++){
						var run_info = [];
						var run_select = '<select id="'+ s[i].id + '_run_select" class="form-control" onchange="optionChange(this)"><form>';
						for(var x = 0; x < run_ids[s[i].id].length; x = x+3){
							//Sample id _ Run id _ Run name
							run_select += '<option id="' + run_ids[s[i].id][x]+ '_' + run_ids[s[i].id][x+1] + '" value="'+ run_ids[s[i].id][x+2] + '">Run ' + run_ids[s[i].id][x] + ': ' + run_ids[s[i].id][x+1] + '</option>'
						}
						run_select += '</form></select>';
						
						table.fnAddData([
							s[i].id,
							s[i].samplename,
							run_select,
							'<button id="sample_removal_'+s[i].id+'" class="btn btn-danger btn-xs pull-right" onclick="removeTableSamples(\''+s[i].id+'\', this)"><i class=\"fa fa-times\"></i></button>'
							]);
						runHelper.push(s[i].id);
						selectionHelper.push(0);
					}
				}});
		checklist_samples.push(id);
		sendBasketInfo(id);
		reportSelection();
	}else{
		//remove
		removeTableSamples(id, document.getElementById('sample_removal_'+id));
		console.log(document.getElementById('sample_checkbox_'+id).checked);
	}
}

function reportSelection(){
	wkeys = [];
	reports = [];
	var ids = [];
	if (getBasketInfo() != undefined) {
		ids = getBasketInfo().split(",");
	}
	for(var y = 0; y < ids.length; y++){
		var table = $('#jsontable_selected_samples').dataTable();
		var option_get = table.fnGetData();
		for(var r = 0; r < option_get.length; r++){
			var option_selected = $(option_get[r][2])[0];
			option_selected.click();
			if (wkeys.indexOf(option_selected.options[selectionHelper[r]].value) < 0) {
				wkeys.push(option_selected.options[selectionHelper[r]].value);
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
		var run_id = option_selected.options[selectionHelper[r]].id.split("_")[0]
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
	var URL = BASE_PATH+"/public/api/getsamplevals.php?" + beforeFormat + 'format=' + format;
	window.open(URL);
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
	var file_name = '';
	var beforeFormat = '';
	if (window.location.href.split('/').indexOf('table') > -1) {
		beforeFormat = window.location.href.split("/table/")[1].split('format=')[0];
	}else{
		beforeFormat = sendToTableGen().split('format=')[0];
	}
	
	$.ajax({ type: "GET",
			url: BASE_PATH+"/public/ajax/tablegenerator.php",
			data: { p: "createTableFile", url: API_PATH+"/public/api/getsamplevals.php?" + beforeFormat + 'format=json2' },
			async: false,
			success : function(s)
			{
				file_name = s;
			}
	});
	$.ajax({ type: "GET",
				url: BASE_PATH+"/public/ajax/tablegenerator.php",
				data: { p: "createNewTable", search: parameters, name: name, file: file_name },
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

function optionSelection(args) {
	console.log(args);
}

function sendTableToPlot(file){
	$.ajax({ type: "GET",
			url: BASE_PATH+"/public/ajax/sessionrequests.php",
			data: { p: "setPlotToggle", type: 'generated', file: file },
			async: false,
			success : function(s)
			{
			}
	});
	window.location.href = BASE_PATH + '/plot';
}

function deleteTable(id){
	$.ajax({ type: "GET",
				url: BASE_PATH+"/public/ajax/tablegenerator.php",
				data: { p: "deleteTable", id: id },
				async: false,
				success : function(s)
				{
					console.log(s);
				}
		});
}

function optionChange(selector){
	selectionHelper[runHelper.indexOf(selector.id.split('_')[0])] = selector.selectedIndex;
	
	reportSelection();
}

$(function() {
	"use strict";
	
	if(window.location.href.split("/").indexOf('table') < 0 && window.location.href.split("/").indexOf('tablereports') < 0){
		//	If within tablecreator page, get basket info
		var sample_ids = getBasketInfo();
		checklist_samples = [];
		if (sample_ids != undefined) {
			checklist_samples =  sample_ids.split(',');
		}
		console.log(checklist_samples);
		var runparams = $('#jsontable_selected_samples').dataTable({ autoFill: true });
		var run_ids = [];
		var samples_with_runs =[];
		
		$.ajax({ type: "GET",
				url: BASE_PATH+"/public/ajax/tablegenerator.php",
				data: { p: "getTableRuns", search: sample_ids },
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
				data: { p: "getTableSamples", search: sample_ids },
				async: false,
				success : function(s)
				{
					console.log(s);
					runparams.fnClearTable();
					for(var i = 0; i < s.length; i++){
						/*
						var checkbox = document.getElementById('sample_checkbox_'+s[i].id);
						console.log(checkbox);
						checkbox.checked = true;
						*/
						var run_info = [];
						var wkey_passer = [];
						var run_select = '<select id="'+ s[i].id + '_run_select" class="form-control" onchange="optionChange(this)"><form>';
						for(var x = 0; x < run_ids[s[i].id].length; x = x+3){
							//	Add wkey's to runID
							wkey_passer.push(run_ids[s[i].id][x+2]);
							//	Sample id _ Run id _ Run name
							run_select += '<option id="' + run_ids[s[i].id][x]+ '_' + run_ids[s[i].id][x+1] + '" value="'+ run_ids[s[i].id][x+2] + '">Run ' + run_ids[s[i].id][x] + ': ' + run_ids[s[i].id][x+1] + '</option>'
						}
						run_select += '</form></select>';
						runHelper.push(s[i].id);
						selectionHelper.push(0);
						
						runparams.fnAddData([
							s[i].id,
							s[i].samplename,
							run_select,
							'<button id="sample_removal_'+s[i].id+'" class="btn btn-danger btn-xs pull-right" onclick="manageCreateChecklists(\''+s[i].id+'\', this)"><i class=\"fa fa-times\"></i></button>'
							]);
					}
				}});
		reportSelection();
	}else if (window.location.href.split("/").indexOf('table') > -1){
		var json_obj;
		var beforeFormat = window.location.href.split("/table/")[1].split('format=')[0];
		$.ajax({ type: "GET",
				url: BASE_PATH +"/public/api/getsamplevals.php?" + beforeFormat + 'format=json',
				async: false,
				success : function(s)
				{
					console.log(s);
					json_obj = s;
				}
		});
		var export_table = document.getElementById('table_export_exp_body');
		
		//export_table.appendChild(createElement('textarea',['id','class','rows'],['generated_box','form-control','25']));
		//document.getElementById('generated_box').innerHTML = json_obj;
		
		var div = createElement('div',['class'],['btn-group']);
		var dropdown = createElement('button',['id','type','class','data-toggle','aria-expanded'],['generated_button','button','btn btn-primary dropdown-toggle','dropdown','false']);
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
									'<li><a href="'+BASE_PATH+'/public/tablecreator/table/'+s[x].parameters+'" id="' + s[x].id+'">View</a></li>' +
									'<li><a id="' + s[x].id+'" onclick="sendTableToPlot(\''+s[x].file+'\')">Plot Table</a></li>' +
									'<li><a href="" id="' + s[x].id+'" onclick="deleteTable(this.id)">Delete</a></li>' +
								'</ul>'+
							'</div>'
						]);
					}
				}
		});
	}
});