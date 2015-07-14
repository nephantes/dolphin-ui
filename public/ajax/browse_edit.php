<?php
//error_reporting(E_ERROR);
error_reporting(E_ALL);
ini_set('report_errors','on');

require_once("../../config/config.php");
require_once("../../includes/dbfuncs.php");
if (!isset($_SESSION) || !is_array($_SESSION)) session_start();
$query = new dbfuncs();

$p = '';

if (isset($_GET['p'])){$p = $_GET['p'];}

if($p == 'updateDatabase')
{

	if (isset($_GET['id'])){$id = $_GET['id'];}
	if (isset($_GET['type'])){$type = $_GET['type'];}
	if (isset($_GET['table'])){$table = $_GET['table'];}
	if (isset($_GET['value'])){$value = $_GET['value'];}
	
	if($type == 'facility' || $type == 'source' || $type == 'organism' || $type == 'molecule'){
		$type_list = json_decode($query->queryTable("SELECT id FROM ngs_".$type." WHERE $type = '$value'"));
		if($type_list != array()){
			$data=$query->runSQL("UPDATE $table SET ".$type."_id = ".$type_list[0]->id." WHERE id = $id"); 	
		}else{
			$query->runSQL("INSERT INTO ngs_".$type." ($type) VALUES ('$value')");
			$insert_id= json_decode($query->queryTable("SELECT id FROM ngs_".$type." WHERE $type = '$value'"));
			$data=$query->runSQL("UPDATE $table SET ".$type."_id = '".$insert_id[0]->id."' WHERE id = $id"); 	
		}
	}else{
		$data=$query->runSQL("UPDATE $table SET $type = '$value' WHERE id = $id"); 	
	}
}
else if($p == 'checkPerms')
{
	if (isset($_GET['id'])){$id = $_GET['id'];}
	if (isset($_GET['uid'])){$uid = $_GET['uid'];}
	if (isset($_GET['table'])){$table = $_GET['table'];}
	
	$owner_id = json_decode($query->queryTable("SELECT owner_id FROM $table WHERE id = $id"));
	if($owner_id[0]->owner_id == $uid){
		$data = 1;
	}else{
		$data = 0;
	}
}
else if($p == 'getDropdownValues')
{
	if (isset($_GET['type'])){$type = $_GET['type'];}
	$data=$query->queryTable("SELECT $type FROM ngs_".$type);
}


header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo $data;
exit;
?>