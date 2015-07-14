/*
 *Author: Nicholas Merowsky
 *Date: 09 Apr 2015
 *Ascription:
 */

var element_highlighted;
var element_highlighted_table;
var element_highlighted_value;
var element_highlighted_id;
var element_highlighted_type;
var element_highlighted_onclick;

var normalized = ['facility', 'source', 'organism', 'molecule', 'lab', 'organization', 'genotype', 'library_type',
				  'biosample_type', 'instrument_model', 'treatment_manufacturer'];

function editBox(uid, id, type, table, element){
	
	var havePermission = 0;
	
	$.ajax({ type: "GET",
					url: BASE_PATH+"/public/ajax/browse_edit.php",
					data: { p: 'checkPerms', id: id, uid: uid, table: table},
					async: false,
					success : function(r)
					{
						havePermission = r;
					}
				});
	
	if (havePermission == 1) {
		if (element_highlighted != null) {
			element_highlighted.innerHTML = element_highlighted_value;
			element_highlighted.onclick = element_highlighted_onclick;
		}
		element_highlighted = element;
		element_highlighted_value = element.innerHTML;
		element_highlighted_id = id;
		element_highlighted_type = type;
		element_highlighted_table = table;
		element_highlighted_onclick = element.onclick;
		element.innerHTML = '';
		
		if (normalized.indexOf(type) > -1) {
			
			element.onclick = '';
			
			var masterDiv = document.createElement('div');
			masterDiv.setAttribute('class','combobox input-group');
			
			var input = document.createElement('input');
			input.setAttribute('type', 'text');
			input.setAttribute('name', 'comboboxfieldname');
			input.setAttribute('id','cb_identifier');
			input.setAttribute('class','cb_identifier')
			
			var button = document.createElement('button');
			button.setAttribute('class', 'btn btn-default btn-group pull-right')
			
			var span = document.createElement('span');
			span.setAttribute('class','caret');
			button.appendChild(span);
			
			var div = document.createElement('div');
			div.setAttribute('class','dropdownlist');
			
			$.ajax({ type: "GET",
				url: BASE_PATH+"/public/ajax/browse_edit.php",
				data: { p: 'getDropdownValues', type: type},
				async: false,
				success : function(r)
				{
					for(var x = 0; x < r.length; x++){
						var a = document.createElement('a');
						a.innerHTML = (r[x][type]);
						div.appendChild(a);
					}
				}
			});
			
			element.appendChild(masterDiv);
			masterDiv.appendChild(input);
			masterDiv.appendChild(button);
			masterDiv.appendChild(div);
			var no = new ComboBox('cb_identifier');
			
		}else{
			var textarea = document.createElement('textarea');
			textarea.setAttribute('type', 'text');
			textarea.setAttribute('class', 'form-control');
			textarea.setAttribute('rows', '5');
			textarea.setAttribute('onkeydown', 'submitChanges(this)');
			
			element.setAttribute('value', element_highlighted_value);
			element.appendChild(textarea);
			textarea.innerHTML = element_highlighted_value;
			element.onclick = '';
		}
	}
}

function submitChanges(ele) {
	console.log(ele);
	console.log(ele.value);
	var successBool = false;
    if(event.keyCode == 13 && ele.value != '' && ele.value != null) {
        $.ajax({ type: "GET",
					url: BASE_PATH+"/public/ajax/browse_edit.php",
					data: { p: 'updateDatabase', id: element_highlighted_id, type: element_highlighted_type, table: element_highlighted_table, value: ele.value},
					async: false,
					success : function(r)
					{
						console.log(r);
						if (r == 1) {
							successBool = true;
						}
					}
				});
		if (successBool) {
			element_highlighted.innerHTML = ele.value;
			element_highlighted.onclick = element_highlighted_onclick;
			
			clearElementHighlighted();
		}
    }else if(event.keyCode == 27) {
		element_highlighted.innerHTML = element_highlighted_value;
		element_highlighted.onclick = element_highlighted_onclick;
		
		clearElementHighlighted();
	}
}


function clearElementHighlighted(){
	element_highlighted = null;
	element_highlighted_table = null;
	element_highlighted_value = null;
	element_highlighted_id = null;
	element_highlighted_type = null;
	element_highlighted_onclick = null;
}