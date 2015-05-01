/*
 *  Author: Nicholas Merowsky
 *  Date: 09 Apr 2015
 *  Ascription:
 */
 
 function postInsertRunparams(json, outputdir, name, description){
   
   var successCheck = false;
   var runlistCheck = "";
   var runID = "";
   var checkedRunGroupID = "";
   
   //check to make sure values are not empty
   if (outputdir == "") {
      outputdir = "/test/directory/change/me/";
   }
   if (name == "") {
      name = "My Run";
   }
   if (description == "") {
      description = "My Description";
   }
   
   //find the run group ID
   var hrefSplit = window.location.href.split("/");
   var rerunLoc = $.inArray('rerun', hrefSplit)
   var runGroupID;
   if (rerunLoc != -1) {
       runGroupID = hrefSplit[rerunLoc+1];
   }else{
       //if not a rerun
       runGroupID = 'new';
   }
   
   $.ajax({
           type: 	'POST',
           url: 	'/dolphin/public/ajax/ngsalterdb.php',
           data:  	{ p: "submitPipeline", json: json, outdir: outputdir, name: name, desc: description, runGroupID: runGroupID },
           async:	false,
           success: function(r)
           {
               successCheck = true;
               if (runGroupID == 'new') {
                  runlistCheck = 'insertRunlist';
                  runID = r;
                  checkedRunGroupID = r; 
               }else{
                  runlistCheck = 'insertRunlist';
                  runID = (parseInt(runGroupID) + r);
                  checkedRunGroupID = runGroupID;
               }
           }
       });
   if (successCheck) {
      return [ runlistCheck, runID, checkedRunGroupID ];
   }else{
      return undefined;
   }
 }

function postInsertRunlist(runlistCheck, sample_ids, runID, runGroupID){
   var successCheck = false;
      if (runlistCheck == 'insertRunlist') {
         $.ajax({
             type: 	'POST',
             url: 	'/dolphin/public/ajax/ngsalterdb.php',
             data:  	{ p: runlistCheck, sampID: sample_ids, runID: runID, runGroupID: runGroupID },
             async:	false,
             success: function(r)
             {
                successCheck = true;
             }
         });
      }
   return successCheck;
}