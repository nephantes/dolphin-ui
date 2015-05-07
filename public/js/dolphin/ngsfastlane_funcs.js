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
		//	Create Box
		var master = createElement('div', ['class'], ['col-md-9']);
		var box = createElement('div', ['class'], ['box box-default']);
		//	Box Header
		var box_head = createElement('div', ['class'], ['box-header with-border']);
		var header = createElement('h3', ['class', 'value'], ['box-title', id_array[9]]);
		header.innerHTML = id_array[9];
		box_head.appendChild(header);
		box.appendChild(box_head);
		//	Box Body
		var box_body = createElement('div', ['class'], ['box-body']);
		var input_group = createElement('div', ['class'], ['input-group margin col-md-11']);
		var form = createElement('form', ['role'], ['form']);
		var form_group = createElement('div', ['class'], ['form-group']);
		//	Textbox Generation
		var	textbox = createElement('textarea', ['id', 'type', 'class', 'rows', 'placeholder'], [id_array[9], 'text', 'form-control', '5', 'lib_rep1 GATACA\nlib_rep2 CATATC ']);
		form_group.appendChild(textbox);
		//	Merge all the divs
		form.appendChild(form_group);
		input_group.appendChild(form);
		box_body.appendChild(input_group);
		box.appendChild(box_body);
		master.appendChild(box);
		barcodeDiv.appendChild(master);
	}else{
		barcodeDiv.innerHTML = "";
	}
}

function submitFastlane() {
	var value_array = [];
	for(var x = 0; x < id_array.length; x++){
		if (document.getElementById(id_array[x]) != null) {
			value_array.push(document.getElementById(id_array[x]).value);
		}
	}
	postFastlane(value_array);
}