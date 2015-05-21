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
	var parsed = [];
	$.ajax({ type: "GET",
			url: BASE_PATH + "/public/api/?source=" + API_PATH + "/public/pub/" + wkey + "/" + url_path,
			async: false,
			success : function(s)
			{
				for( var j = 0; j < s.length; j++){
					parsed.push(s[j][jsonName]);
				}
			}
	});
	return parsed;
}

function parseMoreTSV(jsonNameArray, url_path){
	var parsed = [];
	$.ajax({ type: "GET",
			url: BASE_PATH + "/public/api/?source=" + API_PATH + "/public/pub/" + wkey + "/" + url_path,
			async: false,
			success : function(s)
			{
				for( var j = 0; j < s.length; j++){
					for(var k = 0; k < jsonNameArray.length; k++){
						parsed.push(s[j][jsonNameArray[k]]);
					}
				}
			}
	});
	return parsed;
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
			var link = createElement('a', ['href'], [BASE_PATH + '/public/pub/' + wkey + '/fastqc/' + libraries[x] + '/' + libraries[x] + '.fastqc/fastqc_report.html']);
			link.appendChild(document.createTextNode(nameAndDirArray[0][x]));
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
	if(currentResultSelection.split(".")[currentResultSelection.split(".").length - 1] == "tsv" || currentResultSelection.substring(currentResultSelection.length - 3, currentResultSelection.length) == "RNA"){
		var masterDiv = document.getElementById(type+'_exp_body');
	
		if (document.getElementById('jsontable_' + type + '_results') == null) {
			var buttonDiv = createElement('div', ['id', 'class'], ['clear_' + type + '_button_div', 'input-group margin col-md-8']);
			var downloads_link_div = createElement('div', ['id', 'class'], ['downloads_' + type + '_link_div', 'input-group margin col-md-4']);
			buttonDiv.appendChild(createDownloadReportButtons(currentResultSelection, type));
			buttonDiv.appendChild(downloads_link_div);
			masterDiv.appendChild(buttonDiv);
			
			var table = generateSelectionTable(type);
			masterDiv.appendChild(table);
		}else{
			var table = document.getElementById('jsontable_' + type + '_results');
			var newTable = generateSelectionTable(type);
			$('#jsontable_' + type + '_results_wrapper').replaceWith(newTable);
		}
	
		var newTableData = $('#jsontable_' + type + '_results').dataTable();
		var objList = getCountsTableData(currentResultSelection, type);
		newTableData.fnClearTable();
		var selection_array = [];
		
		for (var x = 0; x < objList.length; x++){
			if (type == 'initial_mapping') {
				var objList_row = [objList[x].id];
				for (var y = 0; y < lib_checklist.length; y++){
					objList_row.push(objList[x][lib_checklist[y]]);
				}
			}else if (type == 'RSEM') {
				var objList_row = [objList[x]['gene'], objList[x]['transcript']];
				for (var y = 0; y < libraries.length; y++){
					objList_row.push(objList[x][libraries[y]]);
				}
			}else if (type == 'DESEQ') {
				var objList_row = [objList[x]['name']];
				for (var y = 0; y < libraries.length; y++){
					objList_row.push(objList[x][libraries[y]]);
				}
				objList_row.push(objList[x]['padj']);
				objList_row.push(objList[x]['log2FoldChange']);
				objList_row.push(objList[x]['foldChange']);
			}
			
			selection_array.push(objList_row);
		}
		for(var x = 0; x < selection_array.length - 1; x++){
			newTableData.fnAddData(selection_array[x]);
		}
		newTableData.fnAdjustColumnSizing(true);
		
		if (temp_libs.length <= 0) {
			lib_checklist = [];
		}
	}else{
		var masterDiv = document.getElementById(type+'_exp_body');
		var buttonDiv = createElement('div', ['id', 'class'], ['clear_' + type + '_button_div', 'input-group margin col-md-8']);
		var downloads_link_div = createElement('div', ['id', 'class'], ['downloads_' + type + '_link_div', 'input-group margin col-md-4']);
		buttonDiv.appendChild(createDownloadReportButtons(currentResultSelection, type));
		buttonDiv.appendChild(downloads_link_div);
		masterDiv.appendChild(buttonDiv);
	}
	
}

function clearSelection(type){
	if (document.getElementById('jsontable_' + type + '_results_wrapper') != null) {
		document.getElementById('jsontable_' + type + '_results_wrapper').remove();
	}
	document.getElementById('clear_' + type + '_button_div').remove();
	document.getElementById('select_' + type + '_report').value = '--- Select a Result ---';
}

function generateSelectionTable(type){
	var newTable = createElement('table', ['id', 'class'], ['jsontable_' + type + '_results', 'table table-hover compact']);
	var thead = createElement('thead', [], []);
	var header = createElement('tr', ['id'], [type + '_header']);
	if (type == 'initial_mapping') {
		var thID = createElement('th', [], []);
		thID.innerHTML = 'id';
		header.appendChild(thID);
	for(var x = 0; x < lib_checklist.length; x++){
		var th = createElement('th', [], []);
			th.innerHTML = lib_checklist[x];
			header.appendChild(th);
	}
	}else if (type == 'RSEM') {
		var gene = createElement('th', [], []);
			gene.innerHTML = 'Gene';
			header.appendChild(gene);
		var trans = createElement('th', [], []);
			trans.innerHTML = 'Transcript'
			header.appendChild(trans);
		for(var x = 0; x < libraries.length; x++){
			var th = createElement('th', [], []);
			th.innerHTML = libraries[x];
			header.appendChild(th);
		}
	}else if (type == 'DESEQ') {
		var name = createElement('th', [], []);
			name.innerHTML = 'name';
			header.appendChild(name);
		for(var x = 0; x < libraries.length; x++){
			var th = createElement('th', [], []);
			th.innerHTML = libraries[x];
			header.appendChild(th);
		}
		var padj = createElement('th', [], []);
			padj.innerHTML = 'padj';
			header.appendChild(padj);
		var l2fc = createElement('th', [], []);
			l2fc.innerHTML = 'log2FoldChange';
			header.appendChild(l2fc);
		var fc = createElement('th', [], []);
			fc.innerHTML = 'foldChange';
			header.appendChild(fc);
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
		temp_currentResultSelection = currentResultSelection + '&fields=gene,transcript,' + libraries.toString();
	}else if (type == 'DESEQ') {
		temp_currentResultSelection = currentResultSelection + '&fields=name,' + libraries.toString() + ',padj,log2FoldChange,foldChange';
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
	
	if(currentResultSelection.split(".")[currentResultSelection.split(".").length - 1] == "tsv" || currentResultSelection.substring(currentResultSelection.length - 3, currentResultSelection.length) == "RNA"){
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
					}else{
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
	
	for (var z = 0; z < summary_files.length; z++) {
		if (z == 0){
			table_array.push(parseMoreTSV(['File','Total Reads','Reads 1'], summary_files[z]['file']));
		}else if (z == summary_files.length - 1) {
			table_array.push(parseMoreTSV(['Reads 1', 'Unmapped Reads'], summary_files[z]['file']));
		}else{
			table_array.push(parseTSV('Reads 1', summary_files[z]['file']));
		}
	}

	//Initial Mapping Results
	var reports_table = $('#jsontable_initial_mapping').dataTable();
	reports_table.fnClearTable();
	for (var x = 0; x < ((table_array[0].length/3) - 1); x++) {
		var row_array = [];
		for (var y = 0; y < table_array.length; y++){
			if (y == 0) {
				libraries.push(table_array[y][(x*3)]);
				row_array.push(table_array[y][(x*3)]);
				row_array.push(table_array[y][(x*3) + 1]);
				row_array.push(table_array[y][(x*3) + 2].split(" ")[0]);
			}else if (y == (table_array.length - 1)) {
				row_array.push(table_array[y][(x*2)].split(" ")[0]);
				row_array.push(table_array[y][(x*2) + 1].split(" ")[0]);
			}else{
				row_array.push(table_array[y][x].split(" ")[0]);
			}
		}
		row_array.push("<input type=\"checkbox\" class=\"ngs_checkbox\" name=\"" + row_array[0] + "\" id=\"lib_checkbox_"+x+"\" onClick=\"storeLib(this.name)\">");
		reports_table.fnAddData(row_array);
	}
	createDropdown(summary_rna_type, 'initial_mapping');
	
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
	reports_table.fnAdjustColumnSizing(true);
	}
});
