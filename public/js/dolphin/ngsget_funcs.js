/*
 *  Author: Nicholas Merowsky
 *  Date: 09 Apr 2015
 *  Ascription:
 */
 
function rerunSelected(runID, groupID){
    var sample_ids = [];
    $.ajax({ type: "GET",   
		 url: "/dolphin/public/ajax/ngsquerydb.php",
		 data: { p: "getRunSamples", runID: runID, groupID: groupID },
		 async: false,
		 success : function(s)
		 {
		    for(var i = 0; i < s.length; i++) {
			sample_ids.push(s[i].sample_id);
		    }
		 }
    });
    window.location.href = "/dolphin/pipeline/rerun/" + groupID + "/" + runID + "/" + sample_ids + "$";
}

function reportSelected(runID, groupID){
    var ids = [];
    $.ajax({ type: "GET",   
		 url: "/dolphin/public/ajax/ngsquerydb.php",
		 data: { p: "getRunSamples", runID: runID, groupID: groupID },
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

function getSampleIDs(search){
    var ids= [];  
    $.ajax({ type: "GET",   
		 url: "/dolphin/public/ajax/ngsquerydb.php",
		 data: { p: "getSelectedSamples", search: search },
		 async: false,
		 success : function(s)
		 {
		    for(var i = 0; i < s.length; i++) {
			ids.push(s[i].id);
		    }
		 }
    });
    return ids;
}

function grabReload(groupID){
    jsonArray = [];
    $.ajax({ type: "GET",   
		 url: "/dolphin/public/ajax/ngsquerydb.php",
		 data: { p: "grabReload", groupID: groupID },
		 async: false,
		 success : function(s)
		 {
                    var jsonObj = JSON.parse(s[0].json_parameters);
		    jsonArray.push(jsonObj);
		    jsonArray.push(s[0].outdir);
		    jsonArray.push(s[0].run_name);
		    jsonArray.push(s[0].run_description);
		 }
    });
    return jsonArray
}