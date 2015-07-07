/*
 *Author: Nicholas Merowsky
 *Date: 09 Jun 2015
 *Ascription:
 */

function getInfoBoxData(id){
	id = id.split("-head")[0];
	var info_div = document.getElementById(id+'_info');
	var filled_info_div = document.getElementById(id+'_filled');
	if (filled_info_div == undefined) {
		
		$.ajax({ type: "GET",
			url: BASE_PATH+"/public/ajax/ngsquerydb.php",
			data: { p: "getInfoBoxData", fieldname: id },
			async: false,
			success : function(s)
			{
				var added_info = createElement('h5', ['id'], [id+'_filled']);
				added_info.innerHTML = s[0].help_text;
				info_div.appendChild(added_info);
			}
		});
	}
}