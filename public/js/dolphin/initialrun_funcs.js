/*
 * Author: Nicholas Merowsky
 * Date: 26 Nov 2014
 * Ascription:
 **/

$(function() {
	if (typeof(initialSubmission) != undefined && window.location.href.split("/")[window.location.href.split("/").length -1] == 'process') {
		console.log(initialSubmission);
		var initial_split = initialSubmission.split(",");
		var json;
		var outdir;
		var runname;
		var rundesc;
		var sample_lane;
		var experiment_series;
		var group;
		var perms;

		//	Create the Json object
		if (window.location.href.split("/")[window.location.href.split("/").length - 2] == 'fastlane') {
			runname = 'Fastlane Initial Run';
			rundesc = 'Fastlane Initial Run within import: ' + initial_split[5];
			outdir = initial_split[8] + '/initial_run';
			
			json = '{"genomebuild":"human,hg19"';
			if (initial_split[3] == 'yes') {
				json = json + ',"spaired":"paired"';
			}else{
				json = json + ',"spaired":"no"';
			}
			json = json + ',"resume":"no","fastqc":"no"';
			if (initial_split[2] == 'no') {
				json = json + ',"barcodes":"none","adapters":"none"';
			}else{
				json = json + ',"barcodes":"distance,' + barcode_array.split(',')[0] + ':format,'+ barcode_array.split(",")[1];
				json = json + '","adapters":"' + initial_split[initial_split.length - 3].split(" ")[1].replace(/\:/g, "__cr____cn__") + '"';
			}
			json = json + ',"quality":"none",';
			json = json + '"trim":"none","split":"none","commonind":"none"}'
			
			var names_list = [];
			if (initial_split[2] == 'yes') {
				var names = initial_split[initial_split.length - 3].split(":");
				for(var y = 0; y < names.length; y++){
					if (names_list.indexOf(names[y].split(" ")[0]) == -1) {
						names_list.push(names[y].split(" ")[0]);
					}
				}
			}else{
				var names = initial_split[7].split(":");
				for(var y = 0; y < names.length; y++){
					if (names_list.indexOf(names[y].split(" ")[0]) < 0) {
						names_list.push(names[y].split(" ")[0]);
					}
				}
			}
			
			sample_lane = "'" + initial_split[5] + "'";
			experiment_series = initial_split[4];
			group = initial_split[initial_split.length - 2];
			perms = initial_split[initial_split.length - 1];
			
		}else{
			runname = 'Import Initial Run';
			rundesc = 'Import Initial Run within series: ' + initial_split[0];
			outdir = initial_split[1] + '/initial_run';
			experiment_series = initial_split[0];
			
			json = '{"genomebuild":"human,hg19"';
			if (initial_split[4] == 'paired') {
				json = json + ',"spaired":"paired"';
			}else{
				json = json + ',"spaired":"no"';
			}
			json = json + ',"resume":"no","fastqc":"no",';
			if (initial_split[3] == 'lane') {
				json = json + '"barcodes":"distance,1:format,5 end read 1",';
			}else{
				json = json + '"barcodes":"none",';
			}
			json = json + '"adapters":"none",';
			json = json + '"quality":"none",';
			json = json + '"trim":"none","split":"none","commonind":"none"}'
			
			var names_list = initialNameList.split(",");
			console.log(initial_split);
			for(var y = 5; y < initial_split.length; y++ ){
				if (y == 5){
					sample_lane = "'" + initial_split[y] + "'";
				}else{
					sample_lane = sample_lane + ",'" + initial_split[y] + "'";
				}
			}
			group = initial_split[initial_split.length - 2];
			perms = initial_split[initial_split.length - 1];
		}
		
		if (json != undefined && outdir != undefined && runname != undefined && rundesc != undefined) {
			//	Check to see if runparams has already launched
			var run_ids = [];
			var initial_run_ids = [];
			var names_to_ids = [];
			console.log(names_list);
			console.log(sample_lane);
			console.log(experiment_series);
			$.ajax({
				type: 	'GET',
				url: 	BASE_PATH+'/public/ajax/ngsquerydb.php',
				data:  	{ p: 'getSamplesFromName', names: names_list.toString(), lane: sample_lane, experiment: experiment_series },
				async:	false,
				success: function(s)
				{
					for(var x = 0; x < s.length; x++){
						names_to_ids.push(s[x].id);
					}
				}
			});
			console.log(names_to_ids.toString())
			$.ajax({
				type: 	'GET',
				url: 	BASE_PATH+'/public/ajax/initialmappingdb.php',
				data:  	{ p: 'checkRunList', sample_ids: names_to_ids.toString()},
				async:	false,
				success: function(s)
				{
					for(var x = 0; x < s.length; x++){
						run_ids.push(s[x].run_id);
					}
				}
			});
			console.log(run_ids);
			if (run_ids.length > 0) {
				$.ajax({
					type: 	'GET',
					url: 	BASE_PATH+'/public/ajax/initialmappingdb.php',
					data:  	{ p: 'checkRunParams', run_ids: run_ids.toString()},
					async:	false,
					success: function(s)
					{
						for(var x = 0; x < s.length; x++){
							initial_run_ids.push(s[x].id);
						}
					}
				});
				console.log(initial_run_ids);
				if (initial_run_ids.length > 0){
					for(var x = 0; x < initial_run_ids.length; x++){
						var added_samples = [];
						var samples_returned = [];
						$.ajax({
							type: 	'GET',
							url: 	BASE_PATH+'/public/ajax/initialmappingdb.php',
							data:  	{ p: 'checkRunToSamples', run_id: initial_run_ids[x]},
							async:	false,
							success: function(s)
							{
								for(var z = 0; z < s.length; z++){
									samples_returned.push(s[z].sample_id);
								}
								for(var z = 0; z < names_to_ids.length; z++){
									if (samples_returned.indexOf(names_to_ids[z]) < 0) {
										added_samples.push(names_to_ids[z]);
									}
								}
							}
						});
						console.log(added_samples);
						if (added_samples.length > 0) {
							var submitted = postInsertRunlist('insertRunlist', added_samples, initial_run_ids[x]);
							console.log(submitted);
							$.ajax({
								type: 	'GET',
								url: 	BASE_PATH+'/public/ajax/initialmappingdb.php',
								data:  	{ p: 'removeRunlistSamples', run_id: initial_run_ids[x], sample_ids: names_to_ids.toString()},
								async:	false,
								success: function(s)
								{
								}
							});
						}
							var runparamsInsert = postInsertRunparams(json, outdir, runname, rundesc, perms, group);
							console.log(runparamsInsert);
					}
				}
			}else{
				//insert new values into ngs_runparams
				var runparamsInsert = postInsertRunparams(json, outdir, runname, rundesc, perms, group);
				console.log(runparamsInsert);
				console.log(names_to_ids);
				if (window.location.href.split("/")[window.location.href.split("/").length - 2] != 'fastlane') {
					$.ajax({
						type: 	'GET',
						url: 	BASE_PATH+'/public/ajax/initialmappingdb.php',
						data:  	{ p: 'removeRunlistSamples', run_id: runparamsInsert[1], sample_ids: names_to_ids.toString()},
						async:	false,
						success: function(s)
						{
						}
					});
				}
				//insert new values into ngs_runlist
				var submitted = postInsertRunlist(runparamsInsert[0], names_to_ids, runparamsInsert[1]);
				console.log(submitted);
			}
		}
	}
	
});