
var current_avatar;

function selectAvatar(id){
	$( '#'+id ).iCheck('check');
}

function updateProfile(){
	var change_check = true;
	var change_value;
	var imgs = document.getElementsByName('avatar_sel');
	for(var x = 0; x < imgs.length; x++){
		console.log(document.getElementById(imgs[x].alt));
		if (imgs[x].src == BASE_PATH + current_avatar && document.getElementById(imgs[x].alt).checked == true) {
			change_check = false;
		}
		if (document.getElementById(imgs[x].alt).checked == true) {
			change_value = document.getElementById(imgs[x].alt).value;
		}
	}
	console.log(change_value);
	if (change_check) {
		$.ajax({ type: "POST",
			url: "/dolphin/public/ajax/ngsalterdb.php",
			data: { p: 'updateProfile', img: change_value},
			async: false,
			success : function(s)
			{
				location.reload();
			}
		});
	}
}

function obtainKeys(){
	//	FIRST OBTAIN GROUPS
	var groups = [];
	var bucket_list = $('#jsontable_amazon').dataTable();
	$.ajax({ type: "GET",
			url: "/dolphin/public/ajax/ngsquerydb.php",
			data: { p: 'obtainAmazonKeys' },
			async: false,
			success : function(s)
			{
				bucket_list.fnClearTable();
				for(var i = 0; i < s.length; i++) {
					bucket_list.fnAddData([
						s[i].bucket,
						s[i].aws_access_key_id,
						s[i].aws_secret_access_key,
						]);
				}
			}
	});
}

$(function() {
	"use strict";
	
	//	PROFILE AVATAR
	$.ajax({ type: "GET",
			url: "/dolphin/public/ajax/ngsquerydb.php",
			data: { p: 'profileLoad' },
			async: false,
			success : function(s)
			{
				var imgs = document.getElementsByName('avatar_sel');
				current_avatar = s[0].photo_loc;
				for(var x = 0; x < imgs.length; x++){
					if (imgs[x].src == BASE_PATH + current_avatar) {
						imgs[x].click();
					}
				}
			}
	});
	
	//	AMAZON KEYS
	obtainKeys();
});