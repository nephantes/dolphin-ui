/*
 *Author: Nicholas Merowsky
 *Date: 09 Apr 2015
 *Ascription:
 */

var wkey = '';
var lib_checklist = [];
var libraries = [];
var table_array = [];
var currentResultSelection = '--- Select a Result ---';

function parseTSV(jsonName, url_path){
	var parsedArray = [];
	$.ajax({ type: "GET",
			url: BASE_PATH + "/public/api/?source=" + API_PATH + "/public/pub/" + wkey + "/" + url_path,
			async: false,
			success : function(s)
			{
				console.log(s);
				for( var j = 0; j < s.length; j++){
					var parsed = [];
					parsed.push(s[j][jsonName]);
					parsedArray.push(parsed);
				}
			}
	});
	return parsedArray;
}

function parseMoreTSV(jsonNameArray, url_path){
	var parsedArray = [];
	$.ajax({ type: "GET",
			url: BASE_PATH + "/public/api/?source=" + API_PATH + "/public/pub/" + wkey + "/" + url_path,
			async: false,
			success : function(s)
			{
				for( var j = 0; j < s.length; j++){
					var parsed = [];
					for(var k = 0; k < jsonNameArray.length; k++){
						parsed.push(s[j][jsonNameArray[k]]);
					}
					parsedArray.push(parsed);
				}
			}
	});
	return parsedArray;
}

function createSummary(fastqc_summary) {
	if (fastqc_summary) {
		var linkRef = [ '/per_base_quality.html', '/per_base_sequence_content.html', '/per_sequence_quality.html'];
		var linkRefName = ['Per Base Quality Summary', 'Per Base Sequence Content Summary', 'Per Sequence Quality Summary'];
	
		var masterDiv = document.getElementById('summary_exp_body');
	
		for(var x = 0; x < linkRefName.length; x++){
			var link = createElement('a', ['href'], [BASE_PATH + '/public/pub/' + wkey + '/fastqc/UNITED' + linkRef[x]]);
			link.appendChild(document.createTextNode(linkRefName[x]));
			masterDiv.appendChild(link);
			masterDiv.appendChild(createElement('div', [],[]));
		}
	}
}

function createDetails(libraries) {
	var masterDiv = document.getElementById('details_exp_body');
	var hrefSplit = window.location.href.split("/");
	var runId = hrefSplit[hrefSplit.length - 2];
	var pairCheck = findIfMatePaired(runId);
	
	for(var x = 0; x < libraries.length; x++){
		if (pairCheck) {
			var link1 = createElement('a', ['href'], [BASE_PATH + '/public/pub/' + wkey + '/fastqc/' + libraries[x] + '.1/' + libraries[x] + '.1_fastqc/fastqc_report.html']);
			link1.appendChild(document.createTextNode(libraries[x] + ".1"));
			var link2 = createElement('a', ['href'], [BASE_PATH + '/public/pub/' + wkey + '/fastqc/' + libraries[x] + '.2/' + libraries[x] + '.2_fastqc/fastqc_report.html']);
			link2.appendChild(document.createTextNode(libraries[x] + ".2"));
			masterDiv.appendChild(link1);
			masterDiv.appendChild(createElement('div', [],[]));
			masterDiv.appendChild(link2);
			masterDiv.appendChild(createElement('div', [],[]));
		}else{
			var link = createElement('a', ['href'], [BASE_PATH + '/public/pub/' + wkey + '/fastqc/' + libraries[x] + '/' + libraries[x] + '_fastqc/fastqc_report.html']);
			link.appendChild(document.createTextNode(libraries[x]));
			masterDiv.appendChild(link);
			masterDiv.appendChild(createElement('div', [],[]));
		}
		
		
	}
}

/* checkFrontAndEndDir function
 *
 * checks to make sure that the outdir specified has
 * both '/'s on either end in order to be used by whichever
 * function requires the addition of the outdir
 */

function checkFrontAndEndDir(wkey){
	if (wkey[0] != '/') {
		wkey = '/' + wkey;
	}
	if (wkey[wkey.length - 1] != '/') {
		wkey = wkey + '/';
	}
	return wkey;
}

function cleanReports(reads, totalReads){
	var perc = (reads/totalReads).toFixed(3);
	var stringPerc = "" + reads + " (" + perc + "%)";
	return stringPerc;
}

function storeLib(name){
	if (lib_checklist.indexOf(name) > -1) {
		lib_checklist.splice(lib_checklist.indexOf(name), 1);
	}else{
		lib_checklist.push(name);
	}
}

function createDropdown(mapping_list, type){
	var masterDiv = document.getElementById(type+'_exp_body');
	var childDiv = createElement('div', ['id', 'class'], ['select_'+ type + '_div', 'input-group margin col-md-4']);
	var selectDiv = createElement('div', ['id', 'class'], ['inner_select_' + type + '_div', 'input-group-btn margin']);

	selectDiv.appendChild( createElement('select',
					['id', 'class', 'onchange', 'OPTION_DIS_SEL'],
					['select_' + type + '_report', 'form-control', 'showTable("'+type+'")', '--- Select a Result ---']));
	childDiv.appendChild(selectDiv);
	masterDiv.appendChild(childDiv);
	for (var x = 0; x < mapping_list.length; x++){
		var opt = createElement('option', ['id','value'], [mapping_list[x], mapping_list[x]]);
		opt.innerHTML = mapping_list[x];
		document.getElementById('select_' + type + '_report').appendChild(opt);
	}
}

function obtainObjectKeys(obj){
	var keys = [];
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			keys.push(key)
		}
	}
	return keys;
}

function showTable(type){
	var ordered_lib_checklist = [];
	for (var x = 0; x < libraries.length; x++){
		if (lib_checklist.indexOf(libraries[x]) != -1) {
			ordered_lib_checklist.push(libraries[x]);
		}
	}
	lib_checklist = ordered_lib_checklist;
	temp_libs = [null];
	if (lib_checklist.length <= 0) {
		temp_libs = lib_checklist;
		lib_checklist = libraries;
	}
	
	currentResultSelection = document.getElementById('select_' + type + '_report').value
	var objList = getCountsTableData(currentResultSelection, type);
	var keys = obtainObjectKeys(objList[0]);
	if(currentResultSelection.split(".")[currentResultSelection.split(".").length - 1] == "tsv" || currentResultSelection.substring(currentResultSelection.length - 3, currentResultSelection.length) == "RNA" || currentResultSelection == 'ercc'){
		var masterDiv = document.getElementById(type+'_exp_body');
		if (document.getElementById('jsontable_' + type + '_results') == null) {
			var previous_button = false;
			if (document.getElementById('clear_' + type + '_button_div') != null) {
				previous_button = true;
			}
			var buttonDiv = createElement('div', ['id', 'class'], ['clear_' + type + '_button_div', 'input-group margin col-md-8']);
			var downloads_link_div = createElement('div', ['id', 'class'], ['downloads_' + type + '_link_div', 'input-group margin col-md-4']);
			buttonDiv.appendChild(createDownloadReportButtons(currentResultSelection, type));
			buttonDiv.appendChild(downloads_link_div);
			if (previous_button) {
				$('#clear_' + type + '_button_div').replaceWith(buttonDiv);
			}else{
				masterDiv.appendChild(buttonDiv);
			}
			var table = generateSelectionTable(keys, type);
			masterDiv.appendChild(table);
		}else{
			var table = document.getElementById('jsontable_' + type + '_results');
			var newTable = generateSelectionTable(keys, type);
			$('#jsontable_' + type + '_results_wrapper').replaceWith(newTable);
		}
		
		var newTableData = $('#jsontable_' + type + '_results').dataTable();
		newTableData.fnClearTable();
		var selection_array = [];
		for (var x = 0; x < objList.length; x++){
			var objList_row = [];
			for (var y = 0; y < keys.length; y++){
				if (type == 'initial_mapping') {
					if (keys[y].indexOf(lib_checklist)) {
						objList_row.push(objList[x][keys[y]]);
					}else if (keys[y] == "id" || keys[y] == "name" || keys[y] == "len") {
						objList_row.push(objList[x][keys[y]]);
					}
				}else{
					objList_row.push(objList[x][keys[y]]);
				}
			}
			selection_array.push(objList_row);
		}
		for(var x = 0; x < selection_array.length - 1; x++){
			newTableData.fnAddData(selection_array[x]);
		}
		//newTableData.fnAdjustColumnSizing(true);
		
		if (temp_libs.length <= 0) {
			lib_checklist = [];
		}
	}else{
		var masterDiv = document.getElementById(type+'_exp_body');
		if (document.getElementById('clear_' + type + '_button_div') == null) {
			var buttonDiv = createElement('div', ['id', 'class'], ['clear_' + type + '_button_div', 'input-group margin col-md-8']);
			var downloads_link_div = createElement('div', ['id', 'class'], ['downloads_' + type + '_link_div', 'input-group margin col-md-4']);
			buttonDiv.appendChild(createDownloadReportButtons(currentResultSelection, type));
			buttonDiv.appendChild(downloads_link_div);
			masterDiv.appendChild(buttonDiv);
			if (document.getElementById('jsontable_' + type + '_results_wrapper') != null) {
				document.getElementById('jsontable_' + type + '_results_wrapper').remove();
			}
		}else{
			var buttonDiv = createElement('div', ['id', 'class'], ['clear_' + type + '_button_div', 'input-group margin col-md-8']);
			var downloads_link_div = createElement('div', ['id', 'class'], ['downloads_' + type + '_link_div', 'input-group margin col-md-4']);
			buttonDiv.appendChild(createDownloadReportButtons(currentResultSelection, type));
			buttonDiv.appendChild(downloads_link_div);
			$('#clear_' + type + '_button_div').replaceWith(buttonDiv);
			if (document.getElementById('jsontable_' + type + '_results_wrapper') != null) {
				document.getElementById('jsontable_' + type + '_results_wrapper').remove();
			}
		}
	}
	
}

function clearSelection(type){
	if (document.getElementById('jsontable_' + type + '_results_wrapper') != null) {
		document.getElementById('jsontable_' + type + '_results_wrapper').remove();
	}
	document.getElementById('clear_' + type + '_button_div').remove();
	document.getElementById('select_' + type + '_report').value = '--- Select a Result ---';
}

function generateSelectionTable(keys, type){
	var newTable = createElement('table', ['id', 'class'], ['jsontable_' + type + '_results', 'table table-hover compact']);
	var thead = createElement('thead', [], []);
	var header = createElement('tr', ['id'], [type + '_header']);
	if (type == 'initial_mapping') {
		for(var x = 0; x < keys.length; x++){
			if (keys[x].indexOf(lib_checklist)) {
				var th = createElement('th', [], []);
				th.innerHTML = keys[x];
				header.appendChild(th);
			}else if (keys[x] == "id" || keys[x] == "name" || keys[x] == "len") {
				var th = createElement('th', [], []);
				th.innerHTML = keys[x];
				header.appendChild(th);
			}
			
		}
	}else{
		for(var x = 0; x < keys.length; x++){
			var th = createElement('th', [], []);
			th.innerHTML = keys[x];
			header.appendChild(th);
		}
	}
	
	thead.appendChild(header);
	newTable.appendChild(thead);
	return newTable;
}

function getCountsTableData(currentResultSelection, type){
	var objList = [];
	var temp_currentResultSelection;
	if (type == 'initial_mapping') {
		temp_currentResultSelection = 'counts/' + currentResultSelection + '.counts.tsv&fields=id,' + lib_checklist.toString();
	}else if (type == 'RSEM'){
		temp_currentResultSelection = currentResultSelection;
	}else if (type == 'DESEQ') {
		temp_currentResultSelection = currentResultSelection;
	}
	$.ajax({ type: "GET",
			url: BASE_PATH + "/public/api/?source=" + API_PATH + '/public/pub/' + wkey + '/' + temp_currentResultSelection,
			async: false,
			success : function(s)
			{
				objList = s;
			}
	});
	return objList;
}

function createDownloadReportButtons(currentSelection, type){
	var downloadDiv = createElement('div', ['id', 'class'], ['downloads_' + type + '_div', 'btn-group margin pull-left']);
	var ul = createElement('ul', ['class', 'role'], ['dropdown-menu', 'menu']);
	var button = createElement('button', ['type', 'class', 'data-toggle', 'aria-expanded'], ['button', 'btn btn-primary dropdown-toggle', 'dropdown', 'true'])
	button.innerHTML = 'Select Data Options ';
	var span = createElement('span', ['class'], ['fa fa-caret-down']);
	button.appendChild(span);
	
	if(currentResultSelection.split(".")[currentResultSelection.split(".").length - 1] == "tsv" || currentResultSelection.substring(currentResultSelection.length - 3, currentResultSelection.length) == "RNA" || currentResultSelection == 'ercc'){
		var buttonType = ['JSON','JSON2', 'XML', 'HTML'];
		for (var x = 0; x < buttonType.length; x++){
			var li = createElement('li', [], []);
			var a = createElement('a', ['onclick', 'style'], ['downloadReports("'+buttonType[x]+'", "'+type+'")', 'cursor:pointer']);
			a.innerHTML = buttonType[x] + ' link';
			li.appendChild(a);
			ul.appendChild(li);
		}
		ul.appendChild(createElement('li', ['class'], ['divider']));
	}
	var TSV = createElement('li', [], []);
	var TSV_a = createElement('a', ['value', 'onclick', 'style'], ['Download File', 'downloadTSV("'+type+'")', 'cursor:pointer']);
	TSV_a.innerHTML = 'Download File';
	TSV.appendChild(TSV_a);
	ul.appendChild(TSV);
	ul.appendChild(createElement('li', ['class'], ['divider']));
	var clear = createElement('li', [], []);
	var clear_a = createElement('a', ['value', 'onclick', 'style'], ['Clear Selection', 'clearSelection("'+type+'")', 'cursor:pointer']);
	clear_a.innerHTML = 'Clear Selection';
	clear.appendChild(clear_a);
	ul.appendChild(clear);
	
	downloadDiv.appendChild(button);
	downloadDiv.appendChild(ul);

	return downloadDiv;
}

function downloadReports(buttonType, type){
	var temp_currentResultSelection;
	if (type == 'initial_mapping') {
		temp_currentResultSelection = 'counts/' + currentResultSelection + '.counts.tsv&fields=id,' + lib_checklist.toString();
	}else if (type == 'RSEM'){
		temp_currentResultSelection = currentResultSelection + '&fields=gene,transcript,' + libraries.toString();
	}else if (type == 'DESEQ') {
		temp_currentResultSelection = currentResultSelection + '&fields=name,' + libraries.toString() + ',padj,log2FoldChange,foldChange';
	}
	var URL = BASE_PATH + "/public/api/?source=" + API_PATH + '/public/pub/' + wkey + '/' + temp_currentResultSelection + '&format=' + buttonType;
	window.open(URL);
}

function downloadTSV(type){
	var temp_currentResultSelection;
	if (type == 'initial_mapping') {
		temp_currentResultSelection = 'counts/' + currentResultSelection + '.counts.tsv';
	}else{
		temp_currentResultSelection = currentResultSelection;
	}
	var URL = BASE_PATH + '/public/pub/' + wkey + '/' + temp_currentResultSelection
	window.open(URL, '_blank');
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

function sendToPlots(){
	sendWKey(wkey);
	window.location.href = BASE_PATH+ '/plot';
}

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$(function() {
	"use strict";
	if (phpGrab.theSegment == 'report') {

	var hrefSplit = window.location.href.split("/");
	var runId = hrefSplit[hrefSplit.length - 2];
	wkey = getWKey(runId);
	var samples = hrefSplit[hrefSplit.length - 1].substring(0, hrefSplit[hrefSplit.length - 1].length - 1).split(",");
	
	var summary_files = [];
	var count_files = [];
	var RSEM_files = [];
	var DESEQ_files = [];
	
	$.ajax({ type: "GET",
			url: "/dolphin/public/ajax/ngsquerydb.php",
			data: { p: 'getReportList', wkey: wkey },
			async: false,
			success : function(s)
			{
				for(var x = 0; x < s.length; x++){
					if(s[x].type == 'rsem'){
						RSEM_files.push(s[x]);
					}else if (s[x].type == 'deseq'){
						DESEQ_files.push(s[x]);
					}else if (s[x].type == 'summary') {
						summary_files.push(s[x]);
					}else if (s[x].type == 'counts'){
						count_files.push(s[x]);
					}
				}
			}
	});
	
	var summary_rna_type = [];
	for (var z = 0; z < summary_files.length; z++) {
		summary_rna_type.push(summary_files[z]['file'].split("/")[summary_files[z]['file'].split("/").length - 1].split(".")[0]);
	}
	for (var z = 0; z < summary_files.length; z++) {
		document.getElementById('tablerow').appendChild(createElement('th', ['id'], [summary_rna_type[z]]));
		document.getElementById(summary_rna_type[z]).innerHTML = summary_rna_type[z];
	}
	document.getElementById('tablerow').appendChild(createElement('th', ['id'], ['unused']));
	document.getElementById('unused').innerHTML = 'Reads Left';
	document.getElementById('tablerow').appendChild(createElement('th', ['id'], ['selection']));
	document.getElementById('selection').innerHTML = 'Selected';
	
	$.ajax({ type: "GET",
			url: "/dolphin/public/ajax/ngsquerydb.php",
			data: { p: 'getSampleNames', samples: samples.toString() },
			async: false,
			success : function(s)
			{
				for(var x  = 0; x < s.length; x++){
					libraries.push(s[x].name);
				}
			}
	});
	
	if (summary_files.length > 0) {
		console.log(table_array);
		for (var z = 0; z < summary_files.length; z++) {
			if (z == 0){
				if (summary_files.length == 1) {
					var table_array_raw = (parseMoreTSV(['File','Total Reads','Reads 1','Reads >1','Unmapped Reads'], summary_files[z]['file']));
					for(var x = 0; x < table_array_raw.length; x++){
						var table_array_push = [table_array_raw[x][0], table_array_raw[x][1], parseInt(table_array_raw[x][2].split(" ")[0] + table_array_raw[x][3].split(" ")[0]).toString(), table_array_raw[x][4].split(" ")[0]];
						table_array.push(table_array_push);
					}
				}else{
					var table_array_raw = (parseMoreTSV(['File','Total Reads','Reads 1','Reads >1'], summary_files[z]['file']));
					for(var x = 0; x < table_array_raw.length; x++){
						var table_array_push = [table_array_raw[x][0], table_array_raw[x][1], parseInt(table_array_raw[x][2].split(" ")[0] + table_array_raw[x][3].split(" ")[0]).toString()];
						console.log(table_array_push);
						table_array.push(table_array_push);
					}
				}
			}else if (z == summary_files.length - 1) {
				var parsed_add = parseMoreTSV(['Reads 1','Reads >1','Unmapped Reads'], summary_files[z]['file']);
				for(var x = 0; x < table_array.length; x ++){
					var concat_array = table_array[x];
					table_array[x] = concat_array.concat([parseInt(parsed_add[x][0].split(" ")[0] + parsed_add[x][1].split(" ")[0]).toString(), parsed_add[x][2].split(" ")[0]]);
				}
			}else{
				var parsed_add = parseMoreTSV(['Reads 1','Reads >1'], summary_files[z]['file']);
				for(var x = 0; x < table_array.length; x ++){
					var concat_array = table_array[x];
					table_array[x] = concat_array.concat([parseInt(parsed_add[x][0].split(" ")[0] + parsed_add[x][1].split(" ")[0]).toString()]);
				}
			}
		}
		console.log(table_array);
		var separator = 3;
		if (table_array.length == 1) {
			separator = 4;
		}
		//Initial Mapping Results
		var reports_table = $('#jsontable_initial_mapping').dataTable();
		reports_table.fnClearTable();
		for (var x = 0; x < (table_array.length); x++) {
			var row_array = table_array[x];
			var reads_total = row_array[1];
			for(var y = 2; y < row_array.length; y++){
				row_array[y] = row_array[y] + " (" + (row_array[y]/reads_total)*100 + " %)";
			}
			row_array.push("<input type=\"checkbox\" class=\"ngs_checkbox\" name=\"" + row_array[0] + "\" id=\"lib_checkbox_"+x+"\" onClick=\"storeLib(this.name)\">");
			reports_table.fnAddData(row_array);
		}
		createDropdown(summary_rna_type, 'initial_mapping');
	}else{
		document.getElementById('initial_mapping_exp').remove();
	}
	
	//Create a check for FASTQC output????
	if (getFastQCBool(runId)) {
		createSummary(true);
		createDetails(libraries);
	}else{
		document.getElementById('summary_exp').remove();
		document.getElementById('details_exp').remove();
	}
	
	if (DESEQ_files.length > 0) {
		var deseq_file_paths = [];
		for (var z = 0; z < DESEQ_files.length; z++){
			deseq_file_paths.push(DESEQ_files[z].file);
		}
		createDropdown(deseq_file_paths, 'DESEQ');
	}else{
		document.getElementById('DESEQ_exp').remove();
	}
	
	if (RSEM_files.length > 0) {
		var rsem_file_paths = [];
		for (var z = 0; z < RSEM_files.length; z++){
			rsem_file_paths.push(RSEM_files[z].file);
		}
		createDropdown(rsem_file_paths, 'RSEM');
	}else{
		document.getElementById('RSEM_exp').remove();
	}
	//reports_table.fnAdjustColumnSizing(true);
	}
});
