/*
 *Author: Nicholas Merowsky
 *Date: 09 Apr 2015
 *Ascription:
 */

var wkey = '';
var lib_checklist = [];
var nameAndDirArray = [];
var currentResultSelection = '--- Select a Result ---';

function parseTSV(jsonName, url_path){
	var parsed = [];
	$.ajax({ type: "GET",
			url: BASE_PATH + "/public/api/?source=" + BASE_PATH + "/public/pub/" + wkey + "/" + url_path,
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
			url: BASE_PATH + "/public/api/?source=" + BASE_PATH + "/public/pub/" + wkey + "/" + url_path,
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

function createDropdown(mapping_list){
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
	if (lib_checklist.length < 1) {
		alert("Libraries must be selected to view these reports")
		document.getElementById('select_report').value = currentResultSelection;
	}else{
		currentResultSelection = document.getElementById('select_report').value;
		var masterDiv = document.getElementById('initial_mapping_exp_body');
		
		if (document.getElementById('jsontable_selected_results') == null) {
			var buttonDiv = createElement('div', ['id', 'class'], ['clear_button_div', 'input-group margin']);
			var buttonDivInner = createElement('div', ['id', 'class'], ['clear_button_inner_div', 'input-group margin pull-left']);
			var clearButton = createElement('input', ['id', 'type', 'value', 'class', 'onclick'], ['clear_button', 'button', 'Clear Selection', 'btn btn-primary', 'clearSelection()']);
			buttonDivInner.appendChild(clearButton);
			buttonDiv.appendChild(buttonDivInner);
			buttonDiv.appendChild(createDownloadReportButtons());
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
		var objList = getCountsTableData(currentResultSelection).map(JSON.stringify);
		for(var x = 0; x < objList.length; x++){
			 
			var jsonArray = [];
			for( var i in parsed){
				if (parsed[i] != null) {
					jsonArray.push(parsed[i]);
				}
			}
			if (jsonArray.length > 0) {
				newTableData.fnAddData(jsonArray);
			}
		}
		//newTableData.fnSort( [ [0,'asc'] ] );
		newTableData.fnAdjustColumnSizing(true);
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
	var basePath = 'http://galaxyweb.umassmed.edu/csv-to-api/?source=/project/umw_biocore/pub/ngstrack_pub';
	var URL = nameAndDirArray[1][0] + 'counts/' + currentResultSelection + '.counts.tsv&fields=id,' + lib_checklist;

	var objList = [];

	$.ajax({ type: "GET",
			url: basePath + URL,
			async: false,
			success : function(s)
			{
				objList = s;
			}
	});
	return objList;
}

function createDownloadReportButtons(){
	var downloadDiv = createElement('div', ['id', 'class'], ['downloads_div', 'btn-group margin pull-right']);
	var buttonType = ['JSON','JSON2', 'XML', 'HTML'];
	for (var x = 0; x < buttonType.length; x++){
		var button = createElement('input', ['id', 'class', 'type', 'value', 'onclick'], [buttonType[x], 'btn btn-primary', 'button', buttonType[x], 'downloadReports("'+buttonType[x]+'")']);
		downloadDiv.appendChild(button);
	}

	return downloadDiv;
}

function downloadReports(type){
	var basePath = 'http://galaxyweb.umassmed.edu/csv-to-api/?source=/project/umw_biocore/pub/ngstrack_pub';
	var countsType = document.getElementById('select_report').value;
	var URL = checkFrontAndEndDir(wkey) + 'counts/' + countsType + '.counts.tsv&fields=id,' + lib_checklist + '&format=' + type;
	
	if (type == 'JSON') {
		//Download actual file in the future?
		window.open(basePath + URL);
	}else{
		window.open(basePath + URL);
	}
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
	var DESeq_files = [];
	
	$.ajax({ type: "GET",
			url: BASE_PATH + "/public/api/?source=" + BASE_PATH + "/public/pub/" + wkey + "/reports.tsv",
			async: false,
			success : function(s)
			{
				for(var x = 0; x < s.length; x++){
					if(s[x].type == 'rsem'){
						RSEM_files.push(s[x]);
					}else if (s[x].type == 'deseq'){
						DESeq_files.push(s[x]);
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
	
	var table_array = [];
	
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
	var libraries = [];
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
	
	//Create a check for FASTQC output????
	createSummary(getFastQCBool(runId));
	
	createDetails(libraries);
	
	createDropdown(summary_rna_type);
	}
});
