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

/*##### SEND TO PIPELINE WITH SELECTION #####*/
function submitSelected(){
    window.location.href = "/dolphin/pipeline/selectedv2/" + checklist_samples + "$" + checklist_lanes;
}

/*##### CHECK SELECTED FUNCTION #####*/
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
    var outerDiv = document.createElement( 'div' );
	outerDiv.setAttribute('style', 'display:""' );
        outerDiv.setAttribute('id', 'TESTBOXAREA_' + pipelineNum );
    var innerDiv = document.createElement( 'div' );
    var newSelect = document.createElement ( 'select' );
	newSelect.setAttribute('id', 'select_'+pipelineNum );
	newSelect.setAttribute('class', 'form-control');
	newSelect.setAttribute('onchange', 'pipelineSelect('+pipelineNum+')');
	for (var i = 0; i < pipelineDict.length + 1; i++){
	    var opt = document.createElement( 'option' );
	    if ( (i == 0)) {
		opt.value = '--- Select a Pipeline ---';
		opt.innerHTML = '--- Select a Pipeline ---';
		opt.disabled = true;
		opt.selected = true;
		newSelect.appendChild(opt);
	    }else{
		opt.value = pipelineDict[i-1];
		opt.innerHTML = pipelineDict[i-1];
		newSelect.appendChild(opt);
	    }	    
	}
    var selectChildDiv = document.createElement( 'div' );
	selectChildDiv.setAttribute('id', 'select_child_'+pipelineNum);
    var newRemoveBut = document.createElement( 'input' );
	newRemoveBut.setAttribute('id', 'removePipe_' + pipelineNum);
	newRemoveBut.setAttribute('type', 'button');
	newRemoveBut.setAttribute('class', 'btn btn-primary');
	newRemoveBut.setAttribute('style', 'display:""');
	newRemoveBut.setAttribute('value', 'Remove Pipeline');
	newRemoveBut.setAttribute('onclick', 'removePipes('+pipelineNum+')');
    //attach children to parent
    innerDiv.appendChild( newSelect );
    innerDiv.appendChild( selectChildDiv );
    outerDiv.appendChild( innerDiv );
    outerDiv.appendChild( newRemoveBut );
    master.appendChild( outerDiv );
    pipelineNum = pipelineNum + 1;
}

/*##### SELECT/FILL PIPELINE #####*/
//used to generate divs within the html for the additional pipelines
function pipelineSelect(num){
    //Grab some useful variables
    var pipeType = document.getElementById('select_'+num).value;
    var divAdj = document.createElement( 'div' );
	divAdj.setAttribute('id', 'select_child_'+num);
	divAdj.setAttribute('class', 'col-md-11');
    //Check for only one RSEM
    if (pipeType == 'RNASeq RSEM' && rsemSwitch)
    {
	alert("Warning: You cannot select more than one additional RSEM pipeline")
	document.getElementById('select_'+num).value = currentPipelineVal[num];
    }
    else
    {
	if (pipeType == pipelineDict[0]) {
	    //RNASeq RSEM
	    var header1 = document.createElement( 'h5' );
		header1.setAttribute('class', 'box-title');
		header1.appendChild(document.createTextNode("RSEM parameters:"));
	    var textbox1 = document.createElement( 'textarea' );
		textbox1.setAttribute('class', 'form-control');
		
	    var header2 = document.createElement( 'h5' );
		header2.setAttribute('class', 'box-title');
		header2.appendChild(document.createTextNode("IGV/TDF Conversion:"));
	    var select1 = document.createElement( 'select' );
		select1.setAttribute('class', 'form-control');
		var opt1 = document.createElement( 'option' );
		    opt1.value = "Yes";
		    opt1.innerHTML = "Yes"
		var opt2 = document.createElement( 'option' );
		    opt2.value = "No";
		    opt2.innerHTML = "No";
		select1.appendChild(opt2);
		select1.appendChild(opt1);
		
	    var header3 = document.createElement( 'h5' );
		header3.setAttribute('class', 'box-title');
		header3.appendChild(document.createTextNode("BigWig Conversion:"));
	    var select2 = document.createElement( 'select' );
		select2.setAttribute('class', 'form-control');
		var opt3 = document.createElement( 'option' );
		    opt3.value = "Yes";
		    opt3.innerHTML = "Yes";
		var opt4 = document.createElement( 'option' );
		    opt4.value = "No";
		    opt4.innerHTML = "No";
		select2.appendChild(opt4);
		select2.appendChild(opt3);
		    
	    divAdj.appendChild( header1 );
	    divAdj.appendChild( textbox1 );
	    divAdj.appendChild( header2 );
	    divAdj.appendChild( select1 );
	    divAdj.appendChild( header3 );
	    divAdj.appendChild( select2 );
	    rsemSwitch = true;
	}else if (pipeType == pipelineDict[1]) {
	    //Tophat Pipeline
	    var header1 = document.createElement( 'h5' );
		header1.setAttribute('class', 'box-title');
		header1.appendChild(document.createTextNode("Tophat parameters:"));
	    var textbox1 = document.createElement( 'textarea' );
		textbox1.setAttribute('class', 'form-control');
		
	    var header2 = document.createElement( 'h5' );
		header2.setAttribute('class', 'box-title');
		header2.appendChild(document.createTextNode("IGV/TDF Conversion:"));
	    var select1 = document.createElement( 'select' );
		select1.setAttribute('class', 'form-control');
		var opt1 = document.createElement( 'option' );
		    opt1.value = "Yes";
		    opt1.innerHTML = "Yes"
		var opt2 = document.createElement( 'option' );
		    opt2.value = "No";
		    opt2.innerHTML = "No";
		select1.appendChild(opt2);
		select1.appendChild(opt1);
		
	    var header3 = document.createElement( 'h5' );
		header3.setAttribute('class', 'box-title');
		header3.appendChild(document.createTextNode("BigWig Conversion:"));
	    var select2 = document.createElement( 'select' );
		select2.setAttribute('class', 'form-control');
		var opt3 = document.createElement( 'option' );
		    opt3.value = "Yes";
		    opt3.innerHTML = "Yes";
		var opt4 = document.createElement( 'option' );
		    opt4.value = "No";
		    opt4.innerHTML = "No";
		select2.appendChild(opt4);
		select2.appendChild(opt3);
		    
	    divAdj.appendChild( header1 );
	    divAdj.appendChild( textbox1 );
	    divAdj.appendChild( header2 );
	    divAdj.appendChild( select1 );
	    divAdj.appendChild( header3 );
	    divAdj.appendChild( select2 );
	}else if (pipeType == pipelineDict[2]) {
	    //ChipSeq Pipeline
	    var header1 = document.createElement( 'h5' );
		header1.setAttribute('class', 'box-title');
		header1.appendChild(document.createTextNode("Chip Input Definitions:"));
	    var textbox1 = document.createElement( 'textarea' );
		textbox1.setAttribute('class', 'form-control');
		
	    var header2 = document.createElement( 'h5' );
		header2.setAttribute('class', 'box-title');
		header2.appendChild(document.createTextNode("Multimapper:"));
	    var text1 = document.createElement( 'input' );
		text1.setAttribute('type', 'text');
		text1.setAttribute('class', 'form-control');
		text1.setAttribute('value', '1');
		
	    var header3 = document.createElement( 'h5' );
		header3.setAttribute('class', 'box-title');
		header3.appendChild(document.createTextNode("Tag size(bp) for MACS:"));
	    var text2 = document.createElement( 'input' );
		text2.setAttribute('type', 'text');
		text2.setAttribute('class', 'form-control');
		text2.setAttribute('value', '75');
		
	    var header4 = document.createElement( 'h5' );
		header4.setAttribute('class', 'box-title');
		header4.appendChild(document.createTextNode("Band width(bp) for MACS:"));
	    var text3 = document.createElement( 'input' );
		text3.setAttribute('type', 'text');
		text3.setAttribute('class', 'form-control');
		text3.setAttribute('value', '230');
		
	    var header5 = document.createElement( 'h5' );
		header5.setAttribute('class', 'box-title');
		header5.appendChild(document.createTextNode("Effective genome size(bp):"));
	    var text4 = document.createElement( 'input' );
		text4.setAttribute('type', 'text');
		text4.setAttribute('class', 'form-control');
		text4.setAttribute('value', '2700000000');
		
	    var header6 = document.createElement( 'h5' );
		header6.setAttribute('class', 'box-title');
		header6.appendChild(document.createTextNode("IGV/TDF Conversion:"));
	    var select1 = document.createElement( 'select' );
		select1.setAttribute('class', 'form-control');
		var opt1 = document.createElement( 'option' );
		    opt1.value = "Yes";
		    opt1.innerHTML = "Yes"
		var opt2 = document.createElement( 'option' );
		    opt2.value = "No";
		    opt2.innerHTML = "No";
		select1.appendChild(opt2);
		select1.appendChild(opt1);
		
	    var header7 = document.createElement( 'h5' );
		header7.setAttribute('class', 'box-title');
		header7.appendChild(document.createTextNode("BigWig Conversion:"));
	    var select2 = document.createElement( 'select' );
		select2.setAttribute('class', 'form-control');
		var opt3 = document.createElement( 'option' );
		    opt3.value = "Yes";
		    opt3.innerHTML = "Yes";
		var opt4 = document.createElement( 'option' );
		    opt4.value = "No";
		    opt4.innerHTML = "No";
		select2.appendChild(opt4);
		select2.appendChild(opt3);
		    
	    divAdj.appendChild( header1 );
	    divAdj.appendChild( textbox1 );
	    divAdj.appendChild( header2 );
	    divAdj.appendChild( text1 );
	    divAdj.appendChild( header3 );
	    divAdj.appendChild( text2 );
	    divAdj.appendChild( header4 );
	    divAdj.appendChild( text3 );
	    divAdj.appendChild( header5 );
	    divAdj.appendChild( text4 );
	    divAdj.appendChild( header6 );
	    divAdj.appendChild( select1 );
	    divAdj.appendChild( header7 );
	    divAdj.appendChild( select2 );
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
    if (goWord == "Yes") {
	for (var i = 0, len = additionalArray.length; i < len; i++) {
	    values.push(document.getElementById(additionalArray[i]).value);
	}
    }
    return values;
}
/*##### GENERATE ADDITIONAL PIPELINE STR FOR JSON #####*/
function findPipelineValues(){
    var pipeJSON = "";
    if (currentPipelineID.length > 0) {
	pipeJSON = '"pipeline:" ['
    }
    for (var y = 0; y < currentPipelineID.length; y++) {
	pipeJSON += '"' + currentPipelineVal[y];
	var masterDiv = document.getElementById('select_child_'+currentPipelineID[y]).getElementsByTagName('*');
	for (var x = 0; x < masterDiv.length; x++) {
	    var e = masterDiv[x]
	    if (e.type != undefined) {
		pipeJSON += ':' + e.value;
	    }
	}
	if (currentPipelineID[y] == currentPipelineID[currentPipelineID.length - 1]) {
	    pipeJSON += '"]';
	}else{
	    pipeJSON += '",';
	}
    }
    return pipeJSON;
}

/*##### SUBMIT PIPELINE RUN #####*/
function submitPipeline() {
    
    var rnaList = ["ERCC","rRNA","miRNA","tRNA","snRNA","rmsk","Genome","Change Parameters"]
    
    //Static
    var genome = document.getElementById("Genome Build").value;
    var matepair = document.getElementById("Mate-paired").value;
    var freshrun = document.getElementById("Fresh Run").value;
    var outputdir = document.getElementById("Output Directory").value;
    var fastqc = document.getElementById("FastQC").value;

    //Expanding
    var doBarcode = findRadioChecked("Barcode Separation");
    var doAdapter = findRadioChecked("Adapter Removal");
    var doQuality = findRadioChecked("Quality Filtering");
    var doTrimming = findRadioChecked("Trimming");
    var doRNA = findRadioChecked("Common RNAs");
    var doSplit = findRadioChecked("Split FastQ");
    
    var barcode = findAdditionalInfoValues(doBarcode, ["Distance", "Format"]);
    var adapter = findAdditionalInfoValues(doAdapter, ["Adapter"]);
    var quality = findAdditionalInfoValues(doQuality, ["Window Size", "Required Quality", "leading", "trailing", "minlen"]);
    var trimming = findAdditionalInfoValues(doTrimming, ["Single or Paired-end", "5' length 1", "3' length 1", "5' length 2", "3' length 2"]);
    var rna = findAdditionalInfoValues(doRNA, rnaList);
    var split = findAdditionalInfoValues(doSplit, ["Number of reads per file"]);

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
    var json = '{"genomebuild":"' + genome + '",'
    if (matepair == "Yes") {
	json = json + '"spaired":"paired",'
    }
    if (freshrun == "Yes") {
	json = json + '"resume":"resume",'
    }
    if (doBarcode == "Yes") {
	json = json + '"barcodes":"Distance,' + barcode[0] + ':Format,' + barcode[1] + '",' 
    }
	json = json + '"fastqc":"' + fastqc + '",'
    if (doAdapter == "Yes") {
	json = json + '"adapters":"' + adapter[0] + '",'
    }
    if (doQuality == "Yes") {
	json = json + '"quality":"' + quality[0] + ':' + quality[1] + ':' + quality[2] + ':' + quality[3] + ':' + quality[4] + '",'
    }
    if (doTrimming == "Yes") {
	json = json + '"trim":"' + trimming[1] + ',' + trimming[2]
    }
    if (doTrimming == "Yes" && trimming[0] == 'Paired-end') {
	json = json + ',' + trimming[3] + ',' + trimming[4] + '","trimpaired":"paired",'
    }else if(doTrimming == "Yes")
    {
	json = json + '",'
    }
    if (doRNA == "Yes"){
	json = json + '"commonind":"'
	for (var i = 0; i < rna.length; i++) {
	    if (rna[i] == "Yes") {
		json = json + rnaList[i] + ','
	    }
	}
	json = json + '",'
    }
    if (doSplit == "Yes") {
	json = json + '"reads":"' + split[0] + '",'
    }
	json = json + pipelines + '}'
    //end json construction
	
	//find output directory
	var r1 = document.getElementById('Output Directory').value;
	var s2 = "";
	if (r1 == "") {
	    r1 = "/test/directory/change/me/";
	}
    //insert into database
    $.ajax({
	    type: 	'POST',
	    url: 	'/dolphin/public/ajax/ngsquerydb.php',
	    data:  	{ p: "submitPipeline", q: json, r: r1, seg: "", search: s2 },
	    async:	false,
	    success: function(r)
	    {
		s2 = r;
		r1 = 'insertRunlist';
	    }
	});
    if (r1 == 'insertRunlist') {
	$.ajax({
	    type: 	'POST',
	    url: 	'/dolphin/public/ajax/ngsquerydb.php',
	    data:  	{ p: "submitPipeline", q: json, r: r1, seg: ids, search: s2 },
	    async:	false,
	    success: function(r)
	    {
		alert("Your run has been submitted");
	    }
	});
    }
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
    
    //Selected Values
    else if (segment == "selected") {
	theSearch = phpGrab.theSearch;
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
                     data: { p: "getSamples", q: qvar, r: rvar, seg: segment, search: theSearch, start:start.format('YYYY-MM-DD'), end:end.format('YYYY-MM-DD') },
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




