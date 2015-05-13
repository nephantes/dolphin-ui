/*
 *Author: Nicholas Merowsky
 *Date: 07 May 2015
 *Ascription:
 */

var id_array = ['genomebuild', 'barcode_sep', 'spaired', 'series_name', 'lane_name', 'input_dir', 'input_files', 'backup_dir', 'amazon_bucket',
				'Barcode Definitions'];
var formatInfo = ['Barcode is in 5\' end of read 1', 'Barcode is in 3\' end of read 2 or Single end where tag is on 3\' end',
					'Barcode is in Header record using Illumina Casava (pre V1.8) pipeline format', 'There is no barcode on Read 1 of a pair, in this case read 2 must have barcode on 5\' end',
					'Paired end with tag on 5\' end of both reads'];

function expandBarcodeSep(){
	//	Obtain information
	var expandType = document.getElementById('barcode_sep').value;
	var barcodeDiv = document.getElementById('barcode_div');
	
	//	Check the expand type
	if (expandType == 'yes') {
		barcodeDiv.style.display = 'inline';
		document.getElementById('input_files').placeholder = "Paired End Example:\nlane_001_R1.fastq.gz lane_001_R2.fastq\nSingle End Example:\nlane_001.fastq.gz";
	}else{
		barcodeDiv.style.display = 'none';
		document.getElementById('input_files').placeholder = "Paired End Example:\nlibrary_name_rep1 lib_rep1_R1.fastq.gz lib_rep1_R2.fastq.gz\nSingle End Example:\nlibrary_name_rep1 lib_rep1.fastq.gz";
	}
}

function submitFastlaneButton() {
	var value_array = [];
	for(var x = 0; x < id_array.length; x++){
		if (document.getElementById(id_array[x]) != null) {
			value_array.push((document.getElementById(id_array[x]).value).trim());
		}
	}
	
	sendProcessData(value_array, 'fastlane_values');
	var checked_values = checkFastlaneInput(value_array);
	sendProcessData(checked_values, 'pass_fail_values');
	var bad_samples = getBadSamples();
	sendProcessData(bad_samples, 'bad_samples');
}

function backToFastlane(){
	window.history.back();
}

function sentToNewFastlane() {
	window.location.href = "/dolphin/fastlane";
}

function fastlaneToPipeline(sample_ids){
	window.location.href = "/dolphin/pipeline/selected/" + sample_ids + "$";
}

$(function() {
	if(document.getElementById('barcode_sep').value == 'yes'){
		var barcodeDiv = document.getElementById('barcode_div');
		barcodeDiv.style.display = 'inline';
	}
});