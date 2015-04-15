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
    }
    
});