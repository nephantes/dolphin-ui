/*
 *Author: Nicholas Merowsky
 *Date: 07 May 2015
 *Ascription:
 */

var bad_samples = [];

function checkFastlaneInput(info_array){
	//	Declair variables
	var barcode_array = [];
	var input_array = [];
	var database_checks = [];
	var sample_ids = [];
	
	//	Non-database checks
	//	For each input passed
	console.log(info_array);
	console.log(id_array);
	for(var x = 0; x < (id_array.length - 1); x ++){
		if (info_array[x] == '' && id_array[x] != 'amazon_bucket') {
			//	Left a field blank
			database_checks.push(false);
		}else if (id_array[x] == 'barcode_sep' && info_array[x] == 'yes') {
			//	Check Barcode Separation
			var split_barcodes = info_array[id_array.length - 1].split('\n');
			split_barcodes = split_barcodes.filter(function(n){return n != ''});
			var split_check = true;
			for (var y = 0; y < split_barcodes.length; y++) {
				split_barcodes[y].replace('\t', '');
				if (/[\\|\!\@\#\$\%\^\&\*\+\=\[\]\;\:\<\>\<\?\{\}\(\)]/g.test(split_barcodes[y])) {
					split_check = false;
				}else{
					var single_barcode_array = split_barcodes[y].split(' ');
					single_barcode_array = single_barcode_array.filter(function(n){return n != ''});
					if (single_barcode_array.length != 2) {
						//	Not proper Barcode input
						split_check = false;
					}else{
						barcode_array.push(single_barcode_array);
					}
				}
			}
			if (split_check) {
				database_checks.push(true);
			}else{
				database_checks.push(false);
			}
			
		}else if (id_array[x] == 'input_files'){
			//	Paired-end libraries
			var split_inputs = info_array[6].split('\n');
			split_inputs = split_inputs.filter(function(n){return n != ''});
			var input_bool_check = true;
			for (var y = 0; y < split_inputs.length; y++) {
				if (/[\\|\!\@\#\$\%\^\&\*\+\=\[\]\;\:\<\>\<\?\{\}\(\)]/g.test(split_inputs[y])) {
					input_bool_check = false;
				}else{
					var single_input_array = split_inputs[y].split(' ');
					single_input_array = single_input_array.filter(function(n){return n != ''});
					if (info_array[1] == 'yes') {
						if (single_input_array.length != 2  && info_array[2] == 'yes') {
							//	Not proper file input (paired end)
							input_bool_check = false;
						}else if (single_input_array.length != 1  && info_array[2] == 'no') {
							//	Not proper file input (single end)
							input_bool_check = false;
						}else{
							single_input_array.unshift(barcode_array[y][0]);
							input_array.push(single_input_array);
						}
					}else{
						if (single_input_array.length != 3  && info_array[2] == 'yes') {
							//	Not proper file input (paired end)
							input_bool_check = false;
						}else if (single_input_array.length != 2  && info_array[2] == 'no') {
							//	Not proper file input (single end)
							input_bool_check = false;
						}else{
							input_array.push(single_input_array);
						}
					}
				}
			}
			database_checks.push(input_bool_check);
			
		}else if (id_array[x] == 'input_dir' || id_array[x] == 'backup_dir'){
			//	Check inputs that should not contain whitespace
			if (/[\\|\ \!\@\#\$\%\^\&\*\(\)\+\=\[\]\;\:\<\>\<	\?\{\}]/g.test(info_array[x])) {
				//	Contains whitespace
				database_checks.push(false);
			}else{
				database_checks.push(true);
			}
			
		}else{
			//	No errors
			database_checks.push(true);
		}
	}
	
	//	Database checks
	//	Experiment Series
	var experiment_series_id = experimentSeriesCheck(info_array[3]);

	//	Experiments (Lanes)
	if (experiment_series_id > 0) {
		var lane_id = laneCheck(experiment_series_id, info_array[4]);
	}

	//	Samples
	if (experiment_series_id > 0 && lane_id > 0) {
		if (input_array[1] == 'yes') {
			for(z in barcode_array){
				if(sampleCheck(experiment_series_id, lane_id, barcode_array[z][0]) != 0){
					bad_samples.push(barcode_array[z][0]);
				}
			}
		}else{
			for(z in input_array){
				if(sampleCheck(experiment_series_id, lane_id, input_array[z][0]) != 0){
					bad_samples.push(input_array[z][0]);
				}
			}
		}
		if (bad_samples.length > 0) {
			database_checks.push(false);
		}else{
			database_checks.push(true);
		}
	}else{
		database_checks.push(true);
	}
	
	//	Directories
		//	Make sure directories are real?
	//	Files
		//	Make sure files are real?
	
	if (database_checks.indexOf(false) > -1) {
		//	Error in submission, do not submit into database
		return database_checks;
	}else{
		//	May submit into database
		var organism = info_array[0];

		if (experiment_series_id > 0) {
			//	If adding to a experiment series
			if (lane_id > 0) {
				//	If adding to a lane
				if (info_array[1] == 'yes') {
					//	If seperating barcodes
					for (var a = 0; a < barcode_array.length; a++) {
						sample_ids.push(insertSample(experiment_series_id, lane_id, barcode_array[a][0],
										organism, barcode_array[a][1]));
					}
				}else{
					//	If not separating barcodes
					for (var a = 0; a < input_array.length; a++) {
						sample_ids.push(insertSample(experiment_series_id, lane_id, input_array[a][0],
										organism, 'nobarcode'));
					}
				}
			}else{
				//	If creating a lane
				insertLane(experiment_series_id, info_array[4]);
				var lane_id = laneCheck(experiment_series_id, info_array[4]);
				if (info_array[1] == 'yes') {
					//	If separating barcodes
					for (var a = 0; a < barcode_array.length; a++) {
						sample_ids.push(insertSample(experiment_series_id, lane_id, barcode_array[a][0],
										organism, barcode_array[a][1]));
					}
				}else{
					//	If not separating barcodes
					for (var a = 0; a < input_array.length; a++) {
						sample_ids.push(insertSample(experiment_series_id, lane_id, input_array[a][0],
										organism, 'nobarcode'));
					}
				}
			}
		}else{
			//	If creating an experiment series
			insertExperimentSeries(info_array[3]);
			experiment_series_id = experimentSeriesCheck(info_array[3]);
			
			insertLane(experiment_series_id, info_array[4]);
			var lane_id = laneCheck(experiment_series_id, info_array[4]);
			
			if (info_array[1] == 'yes') {
				//	If separating barcodes
				for (var a = 0; a < barcode_array.length; a++) {
					sample_ids.push(insertSample(experiment_series_id, lane_id, barcode_array[a][0],
									organism, barcode_array[a][1]));
				}
			}else{
				//	If not separating barcodes
				for (var a = 0; a < input_array.length; a++) {
					sample_ids.push(insertSample(experiment_series_id, lane_id, input_array[a][0],
									organism, 'nobarcode'));
				}
			}
		}
		
		//	Insert directory information
		insertDirectories(info_array[5], info_array[7], info_array[8]);
		input_directory_id = directoryCheck(info_array[5], info_array[7], info_array[8]);
		
		//	Insert temp files
		for(var g = 0; g < input_array.length; g++){
			if (info_array[1] == 'yes') {
				//	If Barcode sep
				if (input_array[g].length == 2) {
					insertTempLaneFiles(input_array[g][1], lane_id, input_directory_id);
				}else{
					var combined_files = input_array[g][1] + "," + input_array[g][2];
					insertTempLaneFiles(combined_files, lane_id, input_directory_id);
				}
			}else{
				//	If no Barcode sep
				if (input_array[g].length == 2) {
					insertTempSampleFiles(input_array[g][1], sample_ids[g], input_directory_id);
				}else{
					var combined_files = input_array[g][1] + "," + input_array[g][2];
					insertTempSampleFiles(combined_files, sample_ids[g], input_directory_id);
				}
			}
		}
		return sample_ids;
	}
}

function insertExperimentSeries(experiment_name){
	$.ajax({
			type: 	'POST',
			url: 	BASE_PATH+'/public/ajax/ngsfastlanedb.php',
			data:  	{ p: 'insertExperimentSeries', name: experiment_name, gids: phpGrab.gids },
			async:	false,
			success: function(s)
			{
			}
	});
}

function insertLane(experiment_id, lane_name){
	$.ajax({
			type: 	'POST',
			url: 	BASE_PATH+'/public/ajax/ngsfastlanedb.php',
			data:  	{ p: 'insertLane', experiment: experiment_id, lane: lane_name, gids: phpGrab.gids },
			async:	false,
			success: function(s)
			{
			}
	});
}

function insertSample(experiment_id, lane_id, sample_name, organism, barcode){
	var id;
	$.ajax({
			type: 	'GET',
			url: 	BASE_PATH+'/public/ajax/ngsfastlanedb.php',
			data:  	{ p: 'insertSample', experiment: experiment_id, lane: lane_id, sample: sample_name,
					organism: organism, barcode: barcode, gids: phpGrab.gids },
			async:	false,
			success: function(s)
			{
			}
	});
	id = sampleCheck(experiment_id, lane_id, sample_name);
	return id;
}

function insertDirectories(input, backup, amazon){
	$.ajax({
			type: 	'POST',
			url: 	BASE_PATH+'/public/ajax/ngsfastlanedb.php',
			data:  	{ p: 'insertDirectories', input: input, backup: backup, amazon: amazon, gids: phpGrab.gids },
			async:	false,
			success: function(s)
			{
			}
	});
}

function insertTempSampleFiles(filename, sample_id, input_directory_id){
	$.ajax({
			type: 	'POST',
			url: 	BASE_PATH+'/public/ajax/ngsfastlanedb.php',
			data:  	{ p: 'insertTempSample', filename: filename, sample_id: sample_id, input: input_directory_id, gids: phpGrab.gids },
			async:	false,
			success: function(s)
			{
			}
	});
}

function insertTempLaneFiles(file_name, lane_id, dir_id){
	$.ajax({
			type: 	'POST',
			url: 	BASE_PATH+'/public/ajax/ngsfastlanedb.php',
			data:  	{ p: 'insertTempLane', file_name: file_name, lane_id: lane_id, dir_id: dir_id, gids: phpGrab.gids },
			async:	false,
			success: function(s)
			{
			}
	});
}

function experimentSeriesCheck(experiment_name){
	var id;
	$.ajax({
			type: 	'GET',
			url: 	BASE_PATH+'/public/ajax/ngsfastlanedb.php',
			data:  	{ p: 'experimentSeriesCheck', name: experiment_name },
			async:	false,
			success: function(s)
			{
				id = s;
			}
	});
	return id;
}

function laneCheck(experiment_id, lane_name){
	var id;
	$.ajax({
			type: 	'GET',
			url: 	BASE_PATH+'/public/ajax/ngsfastlanedb.php',
			data:  	{ p: 'laneCheck', experiment: experiment_id, lane: lane_name },
			async:	false,
			success: function(s)
			{
				id = s;
			}
	});
	return id;
}

function sampleCheck(experiment_id, lane_id, sample_name){
	var id;
	$.ajax({
			type: 	'GET',
			url: 	BASE_PATH+'/public/ajax/ngsfastlanedb.php',
			data:  	{ p: 'sampleCheck', experiment: experiment_id, lane: lane_id, sample: sample_name },
			async:	false,
			success: function(s)
			{
				id = s;
			}
	});
	return id;
}

function directoryCheck(input, backup, amazon){
	var id;
	$.ajax({
			type: 	'GET',
			url: 	BASE_PATH+'/public/ajax/ngsfastlanedb.php',
			data:  	{ p: 'directoryCheck', input: input, backup: backup, amazon: amazon},
			async:	false,
			success: function(s)
			{
				id = s;
			}
	});
	return id;
}

function sendProcessData(info_array, post_name){
	$.ajax({
			type: 	'GET',
			url: 	BASE_PATH+'/public/ajax/ngsfastlanedb.php',
			data:  	{ p: 'sendProcessData', info_array: info_array, post: post_name},
			async:	false,
			success: function(s)
			{
			}
	});
}

function getBadSamples(){
	return bad_samples;
}

