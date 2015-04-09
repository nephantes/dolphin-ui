/*
 * Author: Alper Kucukural
 * Co-Editor: Nicholas Merowsky
 * Date: 26 Nov 2014
 * Ascription:
 **/

var currentChecked = "";
var checklist_samples = [];
var checklist_lanes = [];
var pipelineNum = 0
var pipelineDict = ['RNASeq RSEM', 'Tophat Pipeline', 'ChipSeq Pipeline'];
var rnaList = ["ercc","rrna","mirna","trna","snrna","rmsk","genome","change parameters"];
var qualityDict = ["window size","required quality","leading","trailing","minlen"];
var trimmingDict = ["single or paired-end", "5 length 1", "3 length 1", "5 length 2", "3 length 2"];
var currentPipelineID = [];
var currentPipelineVal =[];
var rsemSwitch = false;

/*##### CHECKBOX FUNCTIONS #####*/
function pass_data(name, id){
    currentChecked = name;
    if (id == "sample_checkbox") {
    //sample checkbox
	if ( checklist_samples.indexOf( name ) > -1 ){
	    //remove
	    checklist_samples.pop(name);
	}
	else
	{
	    //add
	    checklist_samples.push(name);
	}
    }
    else
    {
    //lane checkbox
    if ( checklist_lanes.indexOf( name ) > -1 ){
	    //remove
	    checklist_lanes.pop(name);
	}
	else
	{
	    //add
	    checklist_lanes.push(name);
	}
    }
}

function passIDData(run_group_id, id){
    currentChecked = name;
    //lane checkbox
    if ( checklist_lanes.indexOf( id ) > -1 ){
	    //remove
	    checklist_lanes.pop(id);
	    checklist_samples.pop(run_group_id);
    }
    else
    {
	//add
	checklist_lanes.push(id);
	checklist_samples.push(run_group_id);
    }
}

/*##### SEND TO PIPELINE WITH SELECTION #####*/
function submitSelected(){
    window.location.href = "/dolphin/pipeline/selectedv2/" + checklist_samples + "$" + checklist_lanes;
}

function rerunSelected(id, groupID){
    var ids = [];
    $.ajax({ type: "GET",   
		 url: "/dolphin/public/ajax/ngsquerydb.php",
		 data: { p: "getRerunSamples", search: id, q: groupID, r: "", seg: "", },
		 async: false,
		 success : function(s)
		 {
		    for(var i = 0; i < s.length; i++) {
			ids.push(s[i].sample_id);
		    }
		 }
    });
    window.location.href = "/dolphin/pipeline/rerun/" + groupID + "/" + ids + "$";
}

function reportSelected(id, groupID){
    var ids = [];
    $.ajax({ type: "GET",   
		 url: "/dolphin/public/ajax/ngsquerydb.php",
		 data: { p: "getRerunSamples", search: id, q: "", r: "", seg: "", },
		 async: false,
		 success : function(s)
		 {
		    for(var i = 0; i < s.length; i++) {
			ids.push(s[i].sample_id);
		    }
		 }
    });
    window.location.href = "/dolphin/pipeline/report/" + ids + "$";
}

function rerunLoad() {
    var hrefSplit = window.location.href.split("/");
    var rerunLoc = $.inArray('rerun', hrefSplit)
    var infoArray = [];
    if (rerunLoc != -1) {
	infoArray = grabReload(hrefSplit[rerunLoc + 1]);

	//repopulate page
	for (var x = 0; x < (infoArray[0].length - 1); x++) {
	    var element = document.getElementById(infoArray[0][x]);
	    if (element != null) {
		if (element.id == "spaired") {
		    if (infoArray[1][x] == 'paired') {
			element.value = 'yes'
		    }else{
			element.value = 'no';
		    }
		}else if (element.id == "resume"){
			element.value = 'no';
		}else{
		    element.value = infoArray[1][x]
		}
	    }else{
		//try radio
		if (infoArray[0][x] != 'pipeline' && infoArray[0][x] != 'trimpaired') {
		    //expand the altered fields
		    var element1 = document.getElementById(infoArray[0][x] + "_yes");
		    var element2 = document.getElementById(infoArray[0][x] + "_no");		    
		    element1.parentNode.setAttribute('aria-checked', 'true');
		    element2.parentNode.setAttribute('aria-checked', 'false');
		    element1.parentNode.setAttribute('class', 'iradio_minimal checked');
		    element2.parentNode.setAttribute('class', 'iradio_minimal');
		    element1.checked = true;
		    element2.checked = false;
		    document.getElementById(infoArray[0][x]+'_exp').setAttribute('class', 'box box-default');
		    document.getElementById(infoArray[0][x]+'_exp_btn').setAttribute('class', 'fa fa-minus');
		    document.getElementById(infoArray[0][x]+'_exp_body').setAttribute('style', 'display: block');
		    
		    //fill the fields that have been expanded
		    
		    var splt1 = infoArray[1][x].split(":");
		    if (splt1.length == 1) {
			if (infoArray[0][x] == 'split') {
			    document.getElementById('number of reads per file_val').value = infoArray[1][x];
			}else{
			    document.getElementById(infoArray[0][x]+'_val').value = infoArray[1][x];
			}
		    }else{
			for (var z = 0; z < splt1.length; z++) {
			    var splt2 = splt1[z].split(",");
			    if (infoArray[0][x] == 'quality') {
				document.getElementById( qualityDict[z]+'_val' ).value = splt2[0];
			    }else if (infoArray[0][x] == 'trim'){
				document.getElementById( trimmingDict[z+1]+'_val' ).value = splt2[0];
				if (infoArray[0][x+1] == 'trimpaired') {
				    document.getElementById( trimmingDict[0]+'_val').value = 'paired-end';
				}
			    }else if (infoArray[0][x] == 'commonind'){
				document.getElementById( splt1[z]+'_val' ).value = 'yes';
			    }else{
				document.getElementById( splt2[0]+'_val' ).value = splt2[1];
			    }
			    
			}
		    }
		}else{
		    //pipeline	    
		    document.getElementById(infoArray[0][x]+'_exp').setAttribute('class', 'box box-default');
		    document.getElementById(infoArray[0][x]+'_exp_btn').setAttribute('class', 'fa fa-minus');
		    
		    var trimPipe = infoArray[1][x].substring(1, infoArray[1][x].length - 1);
		    var splt1 = trimPipe.split(",");
		    for (var i = 0; i < splt1.length; i++){
			var splt2 = splt1[i].split(":");
			if (splt2[0] == pipelineDict[0].toLowerCase()) {
			    //RSEM
			    additionalPipes();
			    document.getElementById('select_'+i).value = pipelineDict[0];
			    pipelineSelect(i);
			    document.getElementById('textarea_'+i).value = splt2[1];
			    document.getElementById('select_1_'+i).value = splt2[2];
			    document.getElementById('select_2_'+i).value = splt2[3];
			}else if (splt2[0] == pipelineDict[1].toLowerCase()) {
			    //Tophat
			    additionalPipes();
			    document.getElementById('select_'+i).value = pipelineDict[1];
			    pipelineSelect(i);
			    document.getElementById('textarea_'+i).value = splt2[1];
			    document.getElementById('select_1_'+i).value = splt2[2];
			    document.getElementById('select_2_'+i).value = splt2[3];
			}else if (splt2[0] == pipelineDict[2].toLowerCase()){
			    //Chipseq
			    additionalPipes();
			    document.getElementById('select_'+i).value = pipelineDict[2];
			    pipelineSelect(i);
			    document.getElementById('textarea_'+i).value = splt2[1];
			    document.getElementById('text_1_'+i).value = splt2[2];
			    document.getElementById('text_2_'+i).value = splt2[3];
			    document.getElementById('select_1_'+i).value = splt2[4];
			    document.getElementById('select_2_'+i).value = splt2[5];
			    document.getElementById('select_3_'+i).value = splt2[6];
			    document.getElementById('select_4_'+i).value = splt2[7];
			}
			
		    }
		    document.getElementById(infoArray[0][x]+'_exp_body').setAttribute('style', 'display: block');
		}
	    }
	}
	document.getElementById('outdir').value = infoArray[2];
	document.getElementById('run_name').value = infoArray[3];
	document.getElementById('description').value = infoArray[4];
    }
}

/*##### CHECK RADIO SELECTED FUNCTION #####*/
function findRadioChecked(title){
    var value = ""
    if (document.getElementById(title+"_yes").checked) {
	value = document.getElementById(title+"_yes").value;
    }else{
	value = document.getElementById(title+"_no").value;
    }
    return value;
}

/*##### REMOVE PIPELINES #####*/
function removePipes(num){
    var div = document.getElementById('TESTBOXAREA_'+ num);
    var index = currentPipelineID.indexOf(num);
    div.parentNode.removeChild(div);
    if (currentPipelineVal[index] == pipelineDict[0]) {
	rsemSwitch = false;
    }
    currentPipelineVal.splice(index,1);
    currentPipelineID.splice(index,1);
}

/*##### ADD PIPELINES #####*/
function additionalPipes(){
    //find parent div
    var master = document.getElementById('masterPipeline');
    //create children divs/elements
    var outerDiv = createElement('div', ['id', 'style'], ['TESTBOXAREA_'+pipelineNum, 'display:""']);
    var innerDiv = document.createElement( 'div' );
    //attach children to parent
    innerDiv.appendChild( createElement('select',
					['id', 'class', 'onchange', 'OPTION_DIS_SEL', 'OPTION', 'OPTION', 'OPTION'],
					['select_'+pipelineNum, 'form-control', 'pipelineSelect('+pipelineNum+')', '--- Select a Pipeline ---',
					pipelineDict[0], pipelineDict[1], pipelineDict[2] ]));
    innerDiv.appendChild( createElement('div', ['id'], ['select_child_'+pipelineNum]));
    outerDiv.appendChild( innerDiv );
    outerDiv.appendChild( createElement('input', ['id', 'type', 'class', 'style', 'value', 'onclick'],
					['removePipe_'+pipelineNum, 'button', 'btn btn-primary', 'display:""', 'Remove Pipeline',
					'removePipes('+pipelineNum+')']));
    //attach to master
    master.appendChild( outerDiv );
    pipelineNum = pipelineNum + 1;
}

/*##### POPULATE EXPANDING BOXES #####
    This will improves the looks of the expanding boxes
    To be worked on at a later date
    
    this is a selection box nick
     
     6, ["Distance","Format"], [[1,2,3,4,5],[
    "5' end, read 1","3' end, read 2 (or 3' end on single end)","Barcode is in header (Illumina Casava)",
    "No barcode on read 1 of a pair (read 2 must have on 5' end)",
    "Paired end, Both reads, 5' end"]]
*/

/*
function populateExpanding(divID, size, types, fields, options){
    var attachDiv = document.getElementById(divID);
    var newDiv = createElement('div', ['id', 'class'], [divID, 'input-group margin col-md-11']);
    for (var x = 0; x < types.length; x += 4) {
	newDiv = mergeTidy(divAdj, size,
				[ [createElement(types[x], [], []), 
				createElement(types[x+1], [], [])], 
	    
				[createElement(types[x+2], [], []),
				createElement(types[x+3], [], [])] ]);
    }
}
*/

/*##### SELECT/FILL PIPELINE #####*/
//used to generate divs within the html for the additional pipelines
function pipelineSelect(num){
    //Grab some useful variables
    var pipeType = document.getElementById('select_'+num).value;
    var divAdj = createElement('div', ['id', 'class'], ['select_child_'+num, 'input-group margin col-md-11']);
    //Check for only one RSEM
    if (pipeType == 'RNASeq RSEM' && rsemSwitch)
    {
	alert("Warning: You cannot select more than one additional RSEM pipeline")
	document.getElementById('select_'+num).value = currentPipelineVal[num];
    }
    else
    {
	//pipelineDict: global variable containing selections
	if (pipeType == pipelineDict[0]) {
	    //RNASeq RSEM		    
	    divAdj.appendChild( createElement('label', ['class','TEXTNODE'], ['box-title', 'RSEM parameters:']));
	    divAdj.appendChild( createElement('textarea', ['id', 'class'], ['textarea_'+num,'form-control']));
	    divAdj = mergeTidy(divAdj, 6,
				[ [createElement('label', ['class','TEXTNODE'], ['box-title', 'IGV/TDF Conversion:']), 
				createElement('select', ['id','class', 'OPTION', 'OPTION'], ['select_1_'+num, 'form-control', 'no', 'yes'])], 
	    
				[createElement('label', ['class','TEXTNODE'], ['box-title', 'BigWig Conversion:']),
				createElement('select', ['id', 'class', 'OPTION', 'OPTION'], ['select_2_'+num, 'form-control', 'no', 'yes'])] ]);
	    rsemSwitch = true;
	}else if (pipeType == pipelineDict[1]) {
	    //Tophat Pipeline
	    divAdj.appendChild( createElement('label', ['class','TEXTNODE'], ['box-title', 'Tophat parameters:']));
	    divAdj.appendChild( createElement('textarea', ['id', 'class'], ['textarea_'+num, 'form-control']));
	    divAdj = mergeTidy(divAdj, 6,
				[ [createElement('label', ['class','TEXTNODE'], ['box-title', 'IGV/TDF Conversion:']), 
				createElement('select', ['id', 'class', 'OPTION', 'OPTION'], ['select_1_'+num, 'form-control', 'no', 'yes'])],
				[createElement('label', ['class','TEXTNODE'], ['box-title', 'BigWig Conversion:']),
				createElement('select', ['id', 'class', 'OPTION', 'OPTION'], ['select_2_'+num, 'form-control', 'no', 'yes'])] ]);
	}else if (pipeType == pipelineDict[2]) {
	    //ChipSeq Pipeline		    
	    divAdj.appendChild( createElement('label', ['class','TEXTNODE'], ['box-title', 'Chip Input Definitions:']));
	    divAdj.appendChild( createElement('textarea', ['id', 'class'], ['textarea_'+num, 'form-control']));
	    divAdj = mergeTidy(divAdj, 6,
				[ [createElement('label', ['class','TEXTNODE'], ['box-title', 'Multimapper:']),
				createElement('input', ['id', 'class', 'type', 'value'], ['text_1_'+num, 'form-control', 'text', '1'])],
				[createElement('label', ['class','TEXTNODE'], ['box-title', 'Tag size(bp) for MACS:']),
				createElement('input', ['id', 'class', 'type', 'value'], ['text_2_'+num, 'form-control', 'text', '75'])] ]);
	    divAdj = mergeTidy(divAdj, 6,
				[ [createElement('label', ['class','TEXTNODE'], ['box-title', 'Band width(bp) for MACS:']),
				createElement('input', ['id', 'class', 'type', 'value'], ['select_1_'+num, 'form-control', 'text', '230'])],
				[createElement('label', ['class','TEXTNODE'], ['box-title', 'Effective genome size(bp):']),
				createElement('input', ['id', 'class', 'type', 'value'], ['select_2_'+num, 'form-control', 'text', '2700000000'])] ]);
	    divAdj = mergeTidy(divAdj, 6,
				[ [createElement('label', ['class','TEXTNODE'], ['box-title', 'IGV/TDF Conversion:']),
				createElement('select', ['id', 'class', 'OPTION', 'OPTION'], ['select_3_'+num, 'form-control', 'no', 'yes'])],
				[createElement('label', ['class','TEXTNODE'], ['box-title', 'BigWig Conversion:']),
				createElement('select', ['id', 'class', 'OPTION', 'OPTION'], ['select_4_'+num, 'form-control', 'no', 'yes'])] ]);
	}
	//replace div
	$('#select_child_'+num).replaceWith(divAdj);
	
	//adjust global pipeline counter
	if (currentPipelineID.indexOf(num) == -1) {
	    currentPipelineID.push(num);
	    currentPipelineVal.push(pipeType);
	}
	else if (currentPipelineID.indexOf(num) != -1 && currentPipelineVal.indexOf(num) != pipeType)
	{
	    if (currentPipelineVal.indexOf(num) == pipelineDict[0]) {
		rsemSwitch = false;
	    }
	    currentPipelineVal[currentPipelineVal.indexOf(num)] = pipeType;
	}
    }
}
 /*##### PUSH IF SELECTED FUNCTION #####*/
function findAdditionalInfoValues(goWord, additionalArray){
    var values = [];
    if (goWord == "yes") {
	for (var i = 0, len = additionalArray.length; i < len; i++) {
	    values.push(document.getElementById(additionalArray[i]+'_val').value);
	}
    }
    return values;
}
/*##### GENERATE ADDITIONAL PIPELINE STR FOR JSON #####*/
function findPipelineValues(){
    var pipeJSON = "";
    if (currentPipelineID.length > 0) {
	pipeJSON = ',"pipeline": "['
    }
    for (var y = 0; y < currentPipelineID.length; y++) {
	pipeJSON += currentPipelineVal[y];
	var masterDiv = document.getElementById('select_child_'+currentPipelineID[y]).getElementsByTagName('*');
	for (var x = 0; x < masterDiv.length; x++) {
	    var e = masterDiv[x]
	    if (e.type != undefined) {
		pipeJSON += ':' + e.value;
	    }
	}
	if (currentPipelineID[y] == currentPipelineID[currentPipelineID.length - 1]) {
	    pipeJSON += ']"';
	}else{
	    pipeJSON += ',';
	}
    }
    return pipeJSON;
}

function grabReload(group_id){
    jsonArray = [];
    typeArray = [];
    valueArray = [];
    $.ajax({ type: "GET",   
		 url: "/dolphin/public/ajax/ngsquerydb.php",
		 data: { p: "getRerunJson", search: group_id, q: "", r: "", seg: "", },
		 async: false,
		 success : function(s)
		 {
		    JSON.parse(s[0].json_parameters, function(k, v){
			typeArray.push(k);
			valueArray.push(v);
		    });
		    
		    jsonArray.push(typeArray);
		    jsonArray.push(valueArray);
		    jsonArray.push(s[0].outdir);
		    jsonArray.push(s[0].run_name);
		    jsonArray.push(s[0].run_description);
		 }
    });
    return jsonArray
}

/*##### SUBMIT PIPELINE RUN #####*/
function submitPipeline(type) {
    
    //Static
    var genome = document.getElementById("genomebuild").value;
    var matepair = document.getElementById("spaired").value;
    var freshrun = document.getElementById("resume").value;
    var outputdir = document.getElementById("outdir").value;
    var fastqc = document.getElementById("fastqc").value;
    var name = document.getElementById("run_name").value;
    var description = document.getElementById("description").value;
    
    //Expanding
    var doBarcode = findRadioChecked("barcodes");
    var doAdapter = findRadioChecked("adapter");
    var doQuality = findRadioChecked("quality");
    var doTrimming = findRadioChecked("trim");
    var doRNA = findRadioChecked("commonind");
    var doSplit = findRadioChecked("split");
    
    var barcode = findAdditionalInfoValues(doBarcode, ["distance", "format"]);
    var adapter = findAdditionalInfoValues(doAdapter, ["adapter"]);
    var quality = findAdditionalInfoValues(doQuality, ["window size", "required quality", "leading", "trailing", "minlen"]);
    var trimming = findAdditionalInfoValues(doTrimming, ["single or paired-end", "5 length 1", "3 length 1", "5 length 2", "3 length 2"]);
    var rna = findAdditionalInfoValues(doRNA, rnaList);
    var split = findAdditionalInfoValues(doSplit, ["number of reads per file"]);

    //Pipeline
    var pipelines = findPipelineValues();
    
    //Grab sample ids
    var ids= [];  
    $.ajax({ type: "GET",   
		 url: "/dolphin/public/ajax/ngsquerydb.php",
		 data: { p: "getSelectedSamples", search: phpGrab.theSearch, q: "", r: "", seg: "", },
		 async: false,
		 success : function(s)
		 {
		    for(var i = 0; i < s.length; i++) {
			ids.push(s[i].id);
		    }
		 }
    });
    
    //start json construction
    var json = '{"genomebuild":"' + genome + '"'
    if (matepair == "yes") {
	json = json + ',"spaired":"paired"'
    }else{
	json = json + ',"spaired":"no"';
    }
    if (freshrun != "yes") {
	json = json + ',"resume":"no"'
    }else{
	json = json + ',"resume":"resume"'
    }
    if (doBarcode == "yes") {
	json = json + ',"barcodes":"Distance,' + barcode[0] + ':Format,' + barcode[1] + '"' 
    }
	json = json + ',"fastqc":"' + fastqc + '"'
    if (doAdapter == "yes") {
	json = json + ',"adapter":"' + adapter[0] + '"'
    }
    if (doQuality == "yes") {
	json = json + ',"quality":"' + quality[0] + ':' + quality[1] + ':' + quality[2] + ':' + quality[3] + ':' + quality[4] + '"'
    }
    if (doTrimming == "yes") {
	json = json + ',"trim":"' + trimming[1] + ':' + trimming[2]
    }
    if (doTrimming == "yes" && trimming[0] == 'Paired-end') {
	json = json + ':' + trimming[3] + ':' + trimming[4] + '","trimpaired":"paired'
    }
    if (doTrimming == 'yes') {
	json = json + "\"";
    }
    if (doRNA == "yes"){
	json = json + ',"commonind":"'
	var rnacheck = true;
	for (var i = 0; i < rna.length; i++) {
	    if (rna[i] == "yes" & rnacheck) {
		json = json + rnaList[i]
		rnacheck = false;
	    }else if (rna[i] == 'yes'){
		json = json + ':' + rnaList[i]
	    }
	}
	json = json + '"'
    }
    if (doSplit == "yes") {
	json = json + ',"split":"' + split[0] + '"'
    }
	json = json + pipelines + '}'
    //end json construction
	
	//find output directory
	var r1 = outputdir;
	var s1 = name;
	var s2 = description;
	submitted = false;
	if (r1 == "") {
	    r1 = "/test/directory/change/me/";
	}
	if (s1 == "") {
	    s1 = "My Run";
	}
	if (s2 == "") {
	    s2 = "My Description";
	}
	var hrefSplit = window.location.href.split("/");
	var rerunLoc = $.inArray('rerun', hrefSplit)
	var rerunID;
	if (rerunLoc != -1) {
	    rerunID = hrefSplit[rerunLoc+1];
	}else{
	    rerunID = 'new';
	}
    //insert into database
    $.ajax({
	    type: 	'POST',
	    url: 	'/dolphin/public/ajax/ngsquerydb.php',
	    data:  	{ p: "submitPipeline", q: json, r: r1, seg: s1, search: s2, runid: rerunID },
	    async:	false,
	    success: function(r)
	    {
		if (rerunID == 'new') {
		    rerunID = r;
		    s2 = r;
		    r1 = 'insertRunlist';
		}else{
		    var intstr = parseInt(rerunID) + r;
		    s2 = intstr;
		    r1 = 'insertRunlist';
		}
	    }
	});
    if (r1 == 'insertRunlist') {
	$.ajax({
	    type: 	'POST',
	    url: 	'/dolphin/public/ajax/ngsquerydb.php',
	    data:  	{ p: "submitPipeline", q: json, r: r1, seg: ids, search: s2, runid: rerunID },
	    async:	false,
	    success: function(r)
	    {
		alert("Your run has been submitted");
		submitted = true;
	    }
	});
    }
    if (submitted) {
	window.location.href = "/dolphin/pipeline/status";
    }
}

$(function() {
    "use strict";

    //Rerun Check
    rerunLoad();
    
    //The Calender
    $("#calendar").datepicker();

    /*##### PAGE DETERMINER #####*/
    
    var qvar = "";
    var rvar = "";
    var segment = "";
    var theSearch = "";
    
    if (phpGrab) {
	var segment = phpGrab.theSegment;
	var theSearch = phpGrab.theSearch;
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
	qvar = phpGrab.theField;  //field
	rvar = unescape(phpGrab.theValue);  //value
    }
    
    /*##### STATUS TABLE #####*/
    if (segment == 'status') {
	var runparams = $('#jsontable_runparams').dataTable();
    
	$.ajax({ type: "GET",   
			 url: "/dolphin/public/ajax/ngsquerydb.php",
			 data: { p: "getStatus", q: qvar, r: rvar, seg: segment, search: theSearch },
			 async: false,
			 success : function(s)
			 {
			    runparams.fnClearTable();
			    for(var i = 0; i < s.length; i++) {
			    var runstat = "";
			    if (s[i].run_status == 0) {
				runstat = '<button type="button" class="btn btn-xs disabled"><i class="fa fa-refresh">\tRunning...</i></button>';
			    }else if (s[i].run_status == 1) {
				runstat = '<button type="button" class="btn btn-success btn-xs disabled"><i class="fa fa-check">\tComplete!</i></button>';
			    }else{
				runstat = '<button type="button" class="btn btn-danger btn-xs disabled"><i class="fa fa-warning">\tError</i></button>';
			    }
			    runparams.fnAddData([
			    s[i].id,
			    s[i].run_group_id,
			    s[i].run_name,
			    s[i].outdir,
			    s[i].run_description,
			    runstat,
			    '<div class="btn-group">' +
			    '<input type="button" id="'+s[i].id+'" name="'+s[i].run_group_id+'" class="btn btn-xs btn-primary" value="Report Details" onClick="reportSelected(this.id, this.name)"/>' + 
			    '<input type="button" id="'+s[i].id+'" name="'+s[i].run_group_id+'" class="btn btn-xs btn-primary disabled" value="Pause" onClick=""/>' +
			    '<input type="button" id="'+s[i].id+'" name="'+s[i].run_group_id+'" class="btn btn-xs btn-primary" value="Re-run" onClick="rerunSelected(this.id, this.name)"/>' +
			    '</div>',
			    ]);
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
			 data: { p: "getStatus", q: qvar, r: rvar, seg: segment, search: theSearch, start:start.format('YYYY-MM-DD'), end:end.format('YYYY-MM-DD') },
			 async: false,
			 success : function(s)
			 {
			    runparams.fnClearTable();
			    for(var i = 0; i < s.length; i++) {
			    var runstat = "";
			    if (s[i].run_status == 0) {
				runstat = '<button type="button" class="btn btn-xs disabled"><i class="fa fa-refresh">\tRunning...</i></button>';
			    }else if (s[i].run_status == 1) {
				runstat = '<button type="button" class="btn btn-success btn-xs disabled"><i class="fa fa-check">\tComplete!</i></button>';
			    }else{
				runstat = '<button type="button" class="btn btn-danger btn-xs disabled"><i class="fa fa-warning">\tError</i></button>';
			    }
			    runparams.fnAddData([
			    s[i].id,
			    s[i].run_group_id,
			    s[i].run_name,
			    s[i].outdir,
			    s[i].run_description,
			    runstat,
			    '<div class="btn-group">' +
			    '<input type="button" id="'+s[i].id+'" name="'+s[i].run_group_id+'" class="btn btn-xs btn-primary" value="Report Details" onClick="reportSelected(this.id, this.name)"/>' + 
			    '<input type="button" id="'+s[i].id+'" name="'+s[i].run_group_id+'" class="btn btn-xs btn-primary disabled" value="Pause" onClick=""/>' +
			    '<input type="button" id="'+s[i].id+'" name="'+s[i].run_group_id+'" class="btn btn-xs btn-primary" value="Re-run" onClick="rerunSelected(this.id, this.name)"/>' +
			    '</div>',
			    ]);
			    } // End For
			 }
		});
    
	});
	
	runparams.fnSort( [ [0,'asc'] ] );
	runparams.fnAdjustColumnSizing(true);
    }
    
    
    /*##### PROTOCOLS TABLE #####*/
     
    var protocolsTable = $('#jsontable_protocols').dataTable();
     
     $.ajax({ type: "GET",   
                     url: "/dolphin/public/ajax/ngsquerydb.php",
                     data: { p: "getProtocols", type:"Dolphin", q: qvar, r: rvar, seg: segment, search: theSearch},
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
                     data: { p: "getProtocols", q: qvar, r: rvar, seg: segment, search: theSearch, start:start.format('YYYY-MM-DD'), end:end.format('YYYY-MM-DD') },
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
                     data: { p: samplesType, q: qvar, r: rvar, seg: segment, search: theSearch },
                     async: false,
                     success : function(s)
                     {
                        samplesTable.fnClearTable();
                        for(var i = 0; i < s.length; i++) {
                        samplesTable.fnAddData([
                        s[i].id,
			"<a href=\"/dolphin/search/details/samples/"+s[i].id+'/'+theSearch+"\">"+s[i].title+"</a>", 
			s[i].source,
			s[i].organism,
			s[i].molecule,
			"<input type=\"checkbox\" class=\"ngs_checkbox\" name=\""+s[i].id+"\" id=\"sample_checkbox\" onClick=\"pass_data(this.name, this.id);\">",
                        ]);
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
                     data: { p: samplesType, q: qvar, r: rvar, seg: segment, search: theSearch, start:start.format('YYYY-MM-DD'), end:end.format('YYYY-MM-DD') },
                     async: false,
                     success : function(s)
                     {
                        samplesTable.fnClearTable();
                        for(var i = 0; i < s.length; i++) {
                        samplesTable.fnAddData([
                        s[i].id,
			"<a href=\"/dolphin/search/details/samples/"+s[i].id+'/'+theSearch+"\">"+s[i].title+"</a>", 
			s[i].source,
			s[i].organism,
			s[i].molecule,
			"<input type=\"checkbox\" class=\"ngs_checkbox\" name=\""+s[i].id+"\" id=\"sample_checkbox\" onClick=\"pass_data(this.name, this.id);\">",
                        ]);
                        } // End For
                     }
            });

    });
    
    samplesTable.fnSort( [ [0,'asc'] ] );
    samplesTable.fnAdjustColumnSizing(true);
    
    /*##### LANES TABLE #####*/
	
    var lanesTable = $('#jsontable_lanes').dataTable();
    
    $.ajax({ type: "GET",   
                     url: "/dolphin/public/ajax/ngsquerydb.php",
                     data: { p: "getLanes", q: qvar, r: rvar, seg: segment, search: theSearch },
                     async: false,
                     success : function(s)
                     {
                        lanesTable.fnClearTable();
                        for(var i = 0; i < s.length; i++) {
                        lanesTable.fnAddData([
                        s[i].id,
			"<a href=\"/dolphin/search/details/experiments/"+s[i].id+'/'+theSearch+"\">"+s[i].name+"</a>", 
			s[i].facility,
			s[i].total_reads,
			s[i].total_samples,
			"<input type=\"checkbox\" class=\"ngs_checkbox\" name=\""+s[i].id+"\" id=\"lane_checkbox\" onClick=\"pass_data(this.name, this.id);\">",
                        ]);
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
                     data: { p: "getLanes", q: qvar, r: rvar, seg: segment, search: theSearch, start:start.format('YYYY-MM-DD'), end:end.format('YYYY-MM-DD') },
                     async: false,
                     success : function(s)
                     {
                        lanesTable.fnClearTable();
                        for(var i = 0; i < s.length; i++) {
                        lanesTable.fnAddData([
                        s[i].id,
			"<a href=\"/dolphin/search/details/experiments/"+s[i].id+'/'+theSearch+"\">"+s[i].name+"</a>", 
			s[i].facility,
			s[i].total_reads,
			s[i].total_samples,
			"<input type=\"checkbox\" class=\"ngs_checkbox\" name=\""+s[i].id+"\" id=\"lane_checkbox\" onClick=\"pass_data(this.name, this.id);\">",
                        ]);
                        } // End For
                     }
            });

    });
    
    lanesTable.fnSort( [ [0,'asc'] ] );
    lanesTable.fnAdjustColumnSizing(true);
    
    /*##### SERIES TABLE #####*/
	
     var experiment_seriesTable = $('#jsontable_experiment_series').dataTable(); 
     $.ajax({ type: "GET",   
                     url: "/dolphin/public/ajax/ngsquerydb.php",
                     data: { p: "getExperimentSeries", q: qvar, r: rvar, seg: segment, search: theSearch },
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
                     data: { p: "getExperimentSeries", q: qvar, r: rvar, seg: segment, search: theSearch, start:start.format('YYYY-MM-DD'), end:end.format('YYYY-MM-DD') },
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
    experiment_seriesTable.fnAdjustColumnSizing(true);
});




