/*
 * Author: Nicholas Merowsky
 * Date: 26 Nov 2014
 * Ascription:
 **/

function pass_name(name){
	currentChecked = name;
	alert(currentChecked);
    }

$(function() {
    "use strict";
    
    var samplesTable = $('#jsontable_selected_samples').dataTable();
    var currentChecked = "";
    
    $(document).on('check', '#sample_checkbox', function(){

    
    $.ajax({ type: "GET",   
			url: "/dolphin/search/index/",
			data: json_object,
			dataType: 'json',
			async: false,
			success : function(s)
			{
			   
			}
	});
    });
});