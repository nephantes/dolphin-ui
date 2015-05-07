/*
 *Author: Nicholas Merowsky
 *Date: 07 May 2015
 *Ascription:
 */

var expandingBoxes = ['Distance', 'Format', 'Barcode Definitions'];
var distanceInfo = [1,2,3,4,5];
var formatInfo = ['Barcode is in 5\' end of read 1', 'Barcode is in 3\' end of read 2 or Single end where tag is on 3\' end',
					'Barcode is in Header record using Illumina Casava (pre V1.8) pipeline format', 'There is no barcode on Read 1 of a pair, in this case read 2 must have barcode on 5\' end',
					'Paired end with tag on 5\' end of both reads'];

function expandBarcodeSep(){
	//	Obtain information
	var expandType = document.getElementById('barcode_sep').value;
	var barcodeDiv = document.getElementById('barcode_div');
	
	if (expandType == 'yes') {
		for (var x = 0; x < expandingBoxes.length; x++) {
			//	Create potential variables
			var select;
			var textbox;
			//	Create Box
			var master = createElement('div', ['class'], ['col-md-'+((x + 1) * 3)]);
			var box = createElement('div', ['class'], ['box box-default']);
			//	Box Header
			var box_head = createElement('div', ['class'], ['box-header with-border']);
			var header = createElement('h3', ['class', 'value'], ['box-title', expandingBoxes[x]]);
			header.innerHTML = expandingBoxes[x];
			box_head.appendChild(header);
			box.appendChild(box_head);
			//	Box Body
			var box_body = createElement('div', ['class'], ['box-body']);
			var input_group = createElement('div', ['class'], ['input-group margin col-md-11']);
			var form = createElement('form', ['role'], ['form']);
			var form_group = createElement('div', ['class'], ['form-group']);
			//	For each type of box created
			if (x == 0) {
				select = createElement('select', ['class', 'id'], ['form-control', expandingBoxes[x].toLowerCase()]);
				for(var y = 0; y < distanceInfo.length; y++){
					var option = createElement('option', ['value'], [distanceInfo[y]]);
					option.innerHTML = distanceInfo[y];
					select.appendChild(option);
				}
			}else if (x == 1) {
				select = createElement('select', ['class', 'id'], ['form-control', expandingBoxes[x].toLowerCase()]);
				for(var y = 0; y < formatInfo.length; y++){
					var option = createElement('option', ['value'], [formatInfo[y]]);
					option.innerHTML = formatInfo[y];
					select.appendChild(option);
				}
			}else{
				textbox = createElement('textarea', ['id', 'type', 'class', 'rows', 'placeholder'], ['barcode_defs', 'text', 'form-control', '5', 'Example_name1 GATACA\nExample_name2 CATATC ']);
				select = null;
			}
			
			//	Populate
			if (select != null) {
				form_group.appendChild(select);
			}else{
				form_group.appendChild(textbox);
			}
			form.appendChild(form_group);
			input_group.appendChild(form);
			box_body.appendChild(input_group);
			box.appendChild(box_body);
			master.appendChild(box);
			barcodeDiv.appendChild(master);
		}
	}else{
		barcodeDiv.innerHTML = "";
	}
}

function submitFastlane() {
	
}