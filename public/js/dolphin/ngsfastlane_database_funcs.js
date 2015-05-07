/*
 *Author: Nicholas Merowsky
 *Date: 07 May 2015
 *Ascription:
 */

function checkFastlaneInput(info_array){
	//	Declair variables
	var barcode_array = [];
	var input_array = [];
	var non_database_checks = [];
	
	//	Non-database checks
	//	For each input passed
	for(var x = 0; x < (id_array.length - 1); x ++){
		if (info_array[x] == '' && id_array[x] != 'amazon_bucket') {
			//	Left a field blank
			non_database_checks.push(false);
		}else if (id_array[x] == 'barcode_sep' && info_array[x] == 'yes') {
			//	Check Barcode Separation
			var split_barcodes = info_array[id_array.length - 1].split('\n');
			split_check = true;
			for (var y = 0; y < split_barcodes.length; y++) {
				var single_barcode_array = split_barcodes[y].split(' ');
				if (single_barcode_array.length != 2) {
					//	Not proper Barcode input
					split_check = false;
				}else{
					barcode_array.push(single_barcode_array);
				}
			}
			if (split_check) {
				non_database_checks.push(true);
			}else{
				non_database_checks.push(false);
			}
			
		}else if (id_array[x] == 'input_files'){
			//	Paired-end libraries
			var split_inputs = info_array[6].split('\n');
			for (var y = 0; y < split_barcodes.length; y++) {
				var single_input_array = split_barcodes[y].split(' ');
				if (single_input_array.length != 3  && info_array[2] == 'yes') {
					//	Not proper file input (paired end)
					non_database_checks.push(false);
				}else if (single_input_array.length != 2  && info_array[2] == 'no') {
					//	Not proper file input (single end)
					non_database_checks.push(false);
				}else{
					input.push(single_input_array);
					non_database_checks.push(true);
				}
			}
			
		}else if (id_array[x] == 'lane_name' || id_array[x] == 'input_dir' || id_array[x] == 'backup_dir'){
			//	Check inputs that should not contain whitespace
			if (/\s/g.test(info_array[x])) {
				//	Contains whitespace
				non_database_checks.push(false);
			}else{
				non_database_checks.push(true);
			}
			
		}else{
			//	No errors
			non_database_checks.push(true);
		}
	}
	
	//	Database checks
	//	Experiment Series
	
	//	Experiments (Lanes)
	
	//	Samples
	
	//	Directories
	
	//	Files
}