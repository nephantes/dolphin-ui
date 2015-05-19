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
var currentResultRSEM = '--- Select a Result ---';

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

function createInitialDropdown(mapping_list){
	var masterDiv = document.getElementById('initial_mapping_exp_body');
	var childDiv = createElement('div', ['id', 'class'], ['select_div', 'input-group margin col-md-4']);
	var selectDiv = createElement('div', ['id', 'class'], ['inner_select_div', 'input-group-btn margin']);

	selectDiv.appendChild( createElement('select',
					['id', 'class', 'onchange', 'OPTION_DIS_SEL'],
					['select_report', 'form-control', 'showSelectTable()', '--- Select a Result ---']));
	childDiv.appendChild(selectDiv);
	masterDiv.appendChild(childDiv);
	for (var x = 0; x < mapping_list.length; x++){
		var opt = createElement('option', ['id','value'], [mapping_list[x], mapping_list[x]]);
		opt.innerHTML = mapping_list[x];
		document.getElementById('select_report').appendChild(opt);
	}
}

function showSelectTable(){
	var temp_libs = [];
	if (lib_checklist.length < 1) {
		temp_libs = lib_checklist;
		lib_checklist = libraries;
	}
	
	currentResultSelection = document.getElementById('select_report').value;
	var masterDiv = document.getElementById('initial_mapping_exp_body');
	
	if (document.getElementById('jsontable_selected_results') == null) {
		var buttonDiv = createElement('div', ['id', 'class'], ['clear_button_div', 'input-group margin col-md-12']);
		var downloads_link_div = createElement('div', ['id', 'class'], ['downloads_link_div', 'input-group margin pull-right']);
		buttonDiv.appendChild(createDownloadReportButtons());
		downloads_link_div.appendChild(createElement('input', ['id', 'class', 'type', 'size'], ['downloadable', 'form-control', 'text', '90']));
		buttonDiv.appendChild(downloads_link_div);
		masterDiv.appendChild(buttonDiv);
		
		var table = generateSelectionTable();
		masterDiv.appendChild(table);
	}else{
		var table = document.getElementById('jsontable_selected_results');
		var newTable = generateSelectionTable();
		$('#jsontable_selected_results_wrapper').replaceWith(newTable);
	}

	var newTableData = $('#jsontable_selected_results').dataTable();
	newTableData.fnClearTable();
	var objList = getCountsTableData(currentResultSelection);
	var selection_array = [];
	for (var x = 0; x < objList.length; x++){
		var objList_row = [objList[x].id];
		for (var y = 0; y < lib_checklist.length; y++){
			objList_row.push(objList[x][lib_checklist[y]]);
		}
		selection_array.push(objList_row);
	}
	for(var x = 0; x < selection_array.length - 1; x++){
		newTableData.fnAddData(selection_array[x]);
	}
	newTableData.fnAdjustColumnSizing(true);
	
	if (lib_checklist.length < 1) {
		lib_checklist = temp_libs;
	}
}

function clearSelection(){
	document.getElementById('jsontable_selected_results_wrapper').remove();
	document.getElementById('clear_button_div').remove();
	document.getElementById('select_report').value = '--- Select a Result ---';
}

function generateSelectionTable(){
	var newTable = createElement('table', ['id', 'class'], ['jsontable_selected_results', 'table table-hover compact']);
	var thead = createElement('thead', [], []);
	var header = createElement('tr', ['id'], ['selected_header']);
	var thID = createElement('th', [], []);
		thID.innerHTML = 'id';
		header.appendChild(thID);
	for(var x = 0; x < lib_checklist.length; x++){
		var th = createElement('th', [], []);
		th.innerHTML = lib_checklist[x];
		header.appendChild(th);
	}
	thead.appendChild(header);
	newTable.appendChild(thead);
	return newTable;
}

function getCountsTableData(currentResultSelection){
	var objList = [];
	$.ajax({ type: "GET",
			url: BASE_PATH + "/public/api/?source=" + API_PATH + '/public/pub/' + wkey + '/counts/' + currentResultSelection + '.counts.tsv&fields=id,' + lib_checklist.toString(),
			async: false,
			success : function(s)
			{
				objList = s;
			}
	});
	return objList;
}

function createDownloadReportButtons(){
	var downloadDiv = createElement('div', ['id', 'class'], ['downloads_div', 'btn-group margin']);
	var ul = createElement('ul', ['class', 'role'], ['dropdown-menu', 'menu']);
	var button = createElement('button', ['type', 'class', 'data-toggle', 'aria-expanded'], ['button', 'btn btn-primary dropdown-toggle', 'dropdown', 'true'])
	button.innerHTML = 'Actions ';
	var span = createElement('span', ['class'], ['fa fa-caret-down']);
	button.appendChild(span);
	
	var buttonType = ['JSON','JSON2', 'XML', 'HTML'];
	for (var x = 0; x < buttonType.length; x++){
		var li = createElement('li', [], []);
		var a = createElement('a', ['onclick', 'style'], ['downloadReports("'+buttonType[x]+'")', 'cursor:pointer']);
		a.innerHTML = buttonType[x];
		li.appendChild(a);
		ul.appendChild(li);
	}
	var divider = createElement('li', ['class'], ['divider']);
	ul.appendChild(divider);
	var clear = createElement('li', [], []);
	var clear_a = createElement('a', ['value', 'onclick', 'style'], ['Clear Selection', 'clearSelection()', 'cursor:pointer']);
	clear_a.innerHTML = 'Clear Selection';
	clear.appendChild(clear_a);
	ul.appendChild(clear);
	
	downloadDiv.appendChild(button);
	downloadDiv.appendChild(ul);

	return downloadDiv;
}

function downloadReports(type){
	var URL = BASE_PATH + "/public/api/?source=" + API_PATH + '/public/pub/' + wkey + '/counts/' + currentResultSelection + '.counts.tsv&fields=id,' + lib_checklist.toString() + '&format=' + type;
	document.getElementById('downloadable').value = URL;
}

function createRSEMDropdown(rsem_files){
	var masterDiv = document.getElementById('rsem_exp_body');
	var childDiv = createElement('div', ['id', 'class'], ['rsem_select_div', 'input-group margin col-md-4']);
	var selectDiv = createElement('div', ['id', 'class'], ['inner_rsem_select_div', 'input-group-btn margin']);

	selectDiv.appendChild( createElement('select',
					['id', 'class', 'onchange', 'OPTION_DIS_SEL'],
					['rsem_select_report', 'form-control', 'showRSEMTable()', '--- Select a Result ---']));
	childDiv.appendChild(selectDiv);
	masterDiv.appendChild(childDiv);
	for (var x = 0; x < rsem_files.length; x++){
		var opt = createElement('option', ['id','value'], [rsem_files[x], rsem_files[x]]);
		opt.innerHTML = rsem_files[x];
		document.getElementById('rsem_select_report').appendChild(opt);
	}
}

function showRSEMTable(){
	currentResultRSEM = document.getElementById('rsem_select_report').value;
	var masterDiv = document.getElementById('rsem_exp_body');
	
	if (document.getElementById('jsontable_rsem_results') == null) {
		var buttonDiv = createElement('div', ['id', 'class'], ['clear_rsem_button_div', 'input-group margin col-md-12']);
		var downloads_link_div = createElement('div', ['id', 'class'], ['rsem_downloads_link_div', 'input-group margin pull-right']);
		buttonDiv.appendChild(createDownloadRSEMReportButtons());
		downloads_link_div.appendChild(createElement('input', ['id', 'class', 'type', 'size'], ['downloadable_rsem', 'form-control', 'text', '90']));
		buttonDiv.appendChild(downloads_link_div);
		masterDiv.appendChild(buttonDiv);
		
		var table = generateRSEMTable();
		masterDiv.appendChild(table);
	}else{
		var table = document.getElementById('jsontable_rsem_results');
		var newTable = generateRSEMTable();
		$('#jsontable_rsem_results_wrapper').replaceWith(newTable);
	}

	var newTableData = $('#jsontable_rsem_results').dataTable();
	newTableData.fnClearTable();
	var objList = getRSEMTableData(currentResultRSEM);
	var selection_array = [];
	for (var x = 0; x < objList.length; x++){
		var objList_row = [objList[x]['gene'], objList[x]['transcript']];
		for (var y = 0; y < libraries.length; y++){
			objList_row.push(objList[x][libraries[y]]);
		}
		selection_array.push(objList_row);
	}
	for(var x = 0; x < selection_array.length - 1; x++){
		newTableData.fnAddData(selection_array[x]);
	}
	newTableData.fnAdjustColumnSizing(true);
}

function clearRSEM(){
	document.getElementById('jsontable_rsem_results_wrapper').remove();
	document.getElementById('clear_rsem_button_div').remove();
	document.getElementById('rsem_select_report').value = '--- Select a Result ---';
}

function generateRSEMTable(){
	var newTable = createElement('table', ['id', 'class'], ['jsontable_rsem_results', 'table table-hover compact']);
	var thead = createElement('thead', [], []);
	var header = createElement('tr', ['id'], ['rsem_header']);
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
	thead.appendChild(header);
	newTable.appendChild(thead);
	return newTable;
}

function getRSEMTableData(currentResultRSEM){
	var objList = [];
	$.ajax({ type: "GET",
			url: BASE_PATH + "/public/api/?source=" + API_PATH + '/public/pub/' + wkey + '/' + currentResultRSEM,
			async: false,
			success : function(s)
			{
				objList = s;
			}
	});
	return objList;
}


function createDownloadRSEMReportButtons(){
	var downloadDiv = createElement('div', ['id', 'class'], ['downloads_div', 'btn-group margin']);
	var ul = createElement('ul', ['class', 'role'], ['dropdown-menu', 'menu']);
	var button = createElement('button', ['type', 'class', 'data-toggle', 'aria-expanded'], ['button', 'btn btn-primary dropdown-toggle', 'dropdown', 'true'])
	button.innerHTML = 'Actions ';
	var span = createElement('span', ['class'], ['fa fa-caret-down']);
	button.appendChild(span);
	
	var buttonType = ['JSON','JSON2', 'XML', 'HTML'];
	for (var x = 0; x < buttonType.length; x++){
		var li = createElement('li', [], []);
		var a = createElement('a', ['onclick', 'style'], ['downloadRSEMReports("'+buttonType[x]+'")', 'cursor:pointer']);
		a.innerHTML = buttonType[x];
		li.appendChild(a);
		ul.appendChild(li);
	}
	var divider = createElement('li', ['class'], ['divider']);
	ul.appendChild(divider);
	var clear = createElement('li', [], []);
	var clear_a = createElement('a', ['value', 'onclick', 'style'], ['Clear Selection', 'clearRSEM()', 'cursor:pointer']);
	clear_a.innerHTML = 'Clear Selection';
	clear.appendChild(clear_a);
	ul.appendChild(clear);
	
	downloadDiv.appendChild(button);
	downloadDiv.appendChild(ul);

	return downloadDiv;
}

function downloadRSEMReports(type){
	var URL = BASE_PATH + "/public/api/?source=" + API_PATH + '/public/pub/' + wkey + '/' + currentResultRSEM + '&format=' + type;
	document.getElementById('downloadable_rsem').value = URL;
}

function createDESEQDropdown(deseq_files){
	var masterDiv = document.getElementById('deseq_exp_body');
	var childDiv = createElement('div', ['id', 'class'], ['deseq_select_div', 'input-group margin col-md-4']);
	var selectDiv = createElement('div', ['id', 'class'], ['inner_deseq_select_div', 'input-group-btn margin']);

	selectDiv.appendChild( createElement('select',
					['id', 'class', 'onchange', 'OPTION_DIS_SEL'],
					['deseq_select_report', 'form-control', 'showDESEQTable()', '--- Select a Result ---']));
	childDiv.appendChild(selectDiv);
	masterDiv.appendChild(childDiv);
	for (var x = 0; x < deseq_files.length; x++){
		var opt = createElement('option', ['id','value'], [deseq_files[x], deseq_files[x]]);
		opt.innerHTML = deseq_files[x];
		document.getElementById('deseq_select_report').appendChild(opt);
	}
}

function showDESEQTable(){
	currentResultDESEQ = document.getElementById('deseq_select_report').value;
	var masterDiv = document.getElementById('deseq_exp_body');
	
	if (document.getElementById('jsontable_deseq_results') == null) {
		var buttonDiv = createElement('div', ['id', 'class'], ['clear_deseq_button_div', 'input-group margin col-md-12']);
		var downloads_link_div = createElement('div', ['id', 'class'], ['deseq_downloads_link_div', 'input-group margin pull-right']);
		buttonDiv.appendChild(createDownloadDESEQReportButtons());
		downloads_link_div.appendChild(createElement('input', ['id', 'class', 'type', 'style', 'size'], ['downloadable_deseq', 'form-control', 'text', 'width:100%', '90']));
		buttonDiv.appendChild(downloads_link_div);
		masterDiv.appendChild(buttonDiv);
		
		var table = generateDESEQTable();
		masterDiv.appendChild(table);
	}else{
		var table = document.getElementById('jsontable_deseq_results');
		var newTable = generateDESEQTable();
		$('#jsontable_deseq_results_wrapper').replaceWith(newTable);
	}

	var newTableData = $('#jsontable_deseq_results').dataTable();
	newTableData.fnClearTable();
	var objList = getDESEQTableData(currentResultDESEQ);
	var selection_array = [];
	for (var x = 0; x < objList.length; x++){
		var objList_row = [objList[x]['name']];
		for (var y = 0; y < libraries.length; y++){
			objList_row.push(objList[x][libraries[y]]);
		}
		objList_row.push(objList[x]['padj']);
		objList_row.push(objList[x]['log2FoldChange']);
		objList_row.push(objList[x]['foldChange']);
		selection_array.push(objList_row);
	}
	for(var x = 0; x < selection_array.length - 1; x++){
		newTableData.fnAddData(selection_array[x]);
	}
	newTableData.fnAdjustColumnSizing(true);
}

function clearDESEQ(){
	document.getElementById('jsontable_deseq_results_wrapper').remove();
	document.getElementById('clear_deseq_button_div').remove();
	document.getElementById('deseq_select_report').value = '--- Select a Result ---';
}

function generateDESEQTable(){
	var newTable = createElement('table', ['id', 'class'], ['jsontable_deseq_results', 'table table-hover compact']);
	var thead = createElement('thead', [], []);
	var header = createElement('tr', ['id'], ['deseq_header']);
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
	thead.appendChild(header);
	newTable.appendChild(thead);
	return newTable;
}

function getDESEQTableData(currentResultDESEQ){
	var objList = [];
	$.ajax({ type: "GET",
			url: BASE_PATH + "/public/api/?source=" + API_PATH + '/public/pub/' + wkey + '/' + currentResultDESEQ,
			async: false,
			success : function(s)
			{
				objList = s;
			}
	});
	return objList;
}


function createDownloadDESEQReportButtons(){
	var downloadDiv = createElement('div', ['id', 'class'], ['downloads_div', 'btn-group margin']);
	var ul = createElement('ul', ['class', 'role'], ['dropdown-menu', 'menu']);
	var button = createElement('button', ['type', 'class', 'data-toggle', 'aria-expanded'], ['button', 'btn btn-primary dropdown-toggle', 'dropdown', 'true'])
	button.innerHTML = 'Actions ';
	var span = createElement('span', ['class'], ['fa fa-caret-down']);
	button.appendChild(span);
	
	var buttonType = ['JSON','JSON2', 'XML', 'HTML'];
	for (var x = 0; x < buttonType.length; x++){
		var li = createElement('li', [], []);
		var a = createElement('a', ['onclick', 'style'], ['downloadDESEQReports("'+buttonType[x]+'")', 'cursor:pointer']);
		a.innerHTML = buttonType[x];
		li.appendChild(a);
		ul.appendChild(li);
	}
	var divider = createElement('li', ['class'], ['divider']);
	ul.appendChild(divider);
	var clear = createElement('li', [], []);
	var clear_a = createElement('a', ['value', 'onclick', 'style'], ['Clear Selection', 'clearDESEQ()', 'cursor:pointer']);
	clear_a.innerHTML = 'Clear Selection';
	clear.appendChild(clear_a);
	ul.appendChild(clear);
	
	downloadDiv.appendChild(button);
	downloadDiv.appendChild(ul);

	return downloadDiv;
}

function downloadDESEQReports(type){
	var URL = BASE_PATH + "/public/api/?source=" + API_PATH + '/public/pub/' + wkey + '/' + currentResultDESEQ + '&format=' + type;
	document.getElementById('downloadable_deseq').value = URL;
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
	reports_table.fnAdjustColumnSizing(true);
	createInitialDropdown(summary_rna_type);
	
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
		createDESEQDropdown(deseq_file_paths);
	}else{
		document.getElementById('deseq_exp').remove();
	}
	
	if (RSEM_files.length > 0) {
		var rsem_file_paths = [];
		for (var z = 0; z < RSEM_files.length; z++){
			rsem_file_paths.push(RSEM_files[z].file);
		}
		createRSEMDropdown(rsem_file_paths);
	}else{
		document.getElementById('rsem_exp').remove();
	}
	
	}
});
