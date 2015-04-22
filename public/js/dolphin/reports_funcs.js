/*
 *  Author: Nicholas Merowsky
 *  Date: 09 Apr 2015
 *  Ascription:
 */

function parseTSV(report, jsonName){
    var basePath = 'http://galaxyweb.umassmed.edu/csv-to-api/?source=/project/umw_biocore/pub/ngstrack_pub/';
    var URL = 'mousetest/counts/' + report + '.summary.tsv';
    var parsed = [];
    var parsePushed = [];
    
    $.ajax({ type: "GET",   
			 url: basePath + URL,
			 async: false,
			 success : function(s)
			 {
                            jsonGrab = s.map(JSON.stringify);
                            for(var i = 0; i < jsonGrab.length - 1; i++){
                                //limit is length minus one, last element is empty
                                parsed = JSON.parse(jsonGrab[i]);
                                parsePushed.push(parsed[jsonName]);
                            }
                         }
    });
    return parsePushed;
}

function parseMoreTSV(report, jsonNameArray){
    var basePath = 'http://galaxyweb.umassmed.edu/csv-to-api/?source=/project/umw_biocore/pub/ngstrack_pub/';
    var URL = 'mousetest/counts/' + report + '.summary.tsv';
    var parsed = [];
    var parsePushed = [];
    
    $.ajax({ type: "GET",   
			 url: basePath + URL,
			 async: false,
			 success : function(s)
			 {
                            jsonGrab = s.map(JSON.stringify);
                            for(var i = 0; i < jsonGrab.length - 1; i++){
                                //limit is length minus one, last element is empty
                                parsed = JSON.parse(jsonGrab[i]);
                                for(var k = 0; k < jsonNameArray.length; k++){
                                    parsePushed.push(parsed[jsonNameArray[k]]);
                                }
                            }
                         }
    });
    return parsePushed;
}

function createSummary() {
    var basePath = 'http://galaxyweb.umassmed.edu/pub/ngstrack_pub/mousetest/fastqc/UNITED';
    var linkRef = [ '/per_base_quality.html', '/per_base_sequence_content.html', '/per_sequence_quality.html'];
    var linkRefName = ['Per Bas Quality Summary', 'Per Base Sequence Content Summary', 'Per Sequence Quality Summary'];
    
    //obtain samples from url
    var hrefSplit = window.location.href.split("/");
    var runId = hrefSplit[hrefSplit.length - 2];
    var samples = hrefSplit[hrefSplit.length - 1].substring(0, hrefSplit[hrefSplit.length - 1].length - 1).split(",");
    
    var masterDiv = document.getElementById('summary_exp_body');
    //### to be implemented with functional database ###
    //var nameAndDirArray = getSummaryInfo(runId, samples);
    var nameAndDirArray = [['','',''],['','','']];
    
    for(var x = 0; x < nameAndDirArray[0].length; x++){
	var link = createElement('a', ['href'], [basePath + nameAndDirArray[1][x] + linkRef[x]]);
	link.appendChild(document.createTextNode(linkRefName[x]));
	masterDiv.appendChild(link);
	masterDiv.appendChild(createElement('div', [],[]));
    }
}

function createDetails() {
    var basePath = 'http://galaxyweb.umassmed.edu';
    //obtain samples from url
    var hrefSplit = window.location.href.split("/");
    var runId = hrefSplit[hrefSplit.length - 2];
    var samples = hrefSplit[hrefSplit.length - 1].substring(0, hrefSplit[hrefSplit.length - 1].length - 1).split(",");
    
    var masterDiv = document.getElementById('details_exp_body');
     
    var nameAndDirArray = getSummaryInfo(runId, samples);
    
    for(var x = 0; x < nameAndDirArray[0].length; x++){
	var splt1 = nameAndDirArray[0][x].split(',');
	for(var y = 0; y < splt1.length; y++){
	    var link = createElement('a', ['href'], [basePath + nameAndDirArray[1][x] + splt1[y]]);
	    link.appendChild(document.createTextNode(splt1[y]));
	    masterDiv.appendChild(link);
	    masterDiv.appendChild(createElement('div', [],[]));
	}
    }
}

function createPlot(){
    var url="http://galaxyweb.umassmed.edu/csv-to-api/?source=http://galaxyweb.umassmed.edu/pub/ngstrack_pub/mousetest/rsem/genes_expression_expected_count.tsv";
    var masterDiv = document.getElementById('plots_exp_body');
    var headDiv = document.getElementById('plots_exp');
    
    var overlay = createElement('div', ['id', 'class'],['overlay', 'overlay']);
    overlay.appendChild(createElement('i', ['class'], ['fa fa-refresh fa-spin']));
    headDiv.appendChild(overlay);
    
    d3.json(url, draw);
}

$(function() {
    "use strict";
    if (phpGrab.theSegment == 'report') {
       var reports_table = $('#jsontable_initial_mapping').dataTable();
       var basePath = 'http://galaxyweb.umassmed.edu/csv-to-api/?source=/project/umw_biocore/pub/ngstrack_pub/';
       var URL = 'mousetest/counts/hg19.summary.tsv';
       
       var jsonGrab = parseMoreTSV('rRNA', ['File', 'Total Reads', 'Unmapped Reads', 'Reads 1']);
       var miRNA = parseTSV('miRNA', 'Reads 1');
       var tRNA= parseTSV('tRNA', 'Reads 1');
       var snRNA = parseTSV('snRNA', 'Reads 1');
       var rmsk = parseTSV('rmsk', 'Reads 1');
       
       //Initial Mapping Results
       reports_table.fnClearTable();
       for (var x = 0; x < rmsk.length; x++) {
           reports_table.fnAddData([
               jsonGrab[x * 4],
               jsonGrab[(x * 4) + 1],
               jsonGrab[(x * 4) + 2],
               0,
               0,
               jsonGrab[(x * 4) + 3],
               miRNA[x],
               tRNA[x],
               snRNA[x],
               rmsk[x],       
               ]);
       }
       reports_table.fnSort( [ [0,'asc'] ] );
       reports_table.fnAdjustColumnSizing(true);
       
       createSummary();
       createDetails();
       createPlot();
    }
});