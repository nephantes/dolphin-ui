<?php
//error_reporting(E_ERROR);
error_reporting(E_ALL);
ini_set('report_errors','on');

require_once("../../config/config.php");
require_once("../../includes/dbfuncs.php");
if (!isset($_SESSION) || !is_array($_SESSION)) session_start();
$query = new dbfuncs();

if (isset($_GET['p'])){$p = $_GET['p'];}

if ($p == 'getTableSamples')
{
	if (isset($_GET['search'])){$search = $_GET['search'];}
	$data=$query->queryTable("
    SELECT id, samplename
	FROM ngs_samples
	WHERE id IN ( $search )
    ");
}
else if ($p == 'getTableRuns')
{
	if (isset($_GET['search'])){$search = $_GET['search'];}
	$data=$query->queryTable("
    SELECT run_id, sample_id, run_name, wkey
	FROM ngs_runlist
	LEFT JOIN ngs_runparams
	ON ngs_runlist.run_id = ngs_runparams.id
	WHERE sample_id IN ( $search )
	AND run_name NOT LIKE '%Initial Run%'
    ");
}
else if ($p == 'getTableReportsList')
{
	if (isset($_GET['wkey'])){$wkey = $_GET['wkey'];}
	$key_count = count(explode(",",$wkey));
	if($key_count == 1){
		$data=$query->queryTable("
		SELECT file
		FROM report_list
		WHERE wkey = '". $wkey ."'
		");
	}else{
		$data=$query->queryTable("
		SELECT file
		FROM report_list
		WHERE wkey IN ( '". implode("','", explode(",",$wkey))."' )
		");
	}
}
else if ($p == 'samplesWithRuns')
{
	$run_ids_json=json_decode($query->queryTable("
		SELECT distinct ngs_runparams.`id`, ngs_runparams.`run_name` NOT LIKE '%Initial Run%' as `irc`
		FROM biocore.ngs_runparams
		LEFT JOIN report_list
		ON ngs_runparams.wkey = report_list.wkey
		"));
	$run_ids = array();
	foreach($run_ids_json as $rij){
		if($rij->irc == '1'){
			array_push($run_ids, $rij->id);
		}
	}
	$data=$query->queryTable("
		SELECT distinct sample_id
		FROM ngs_runlist
		WHERE run_id in ( " . implode(",",$run_ids) . " )
		");
}
else if ($p == 'getCreatedTables')
{	
	$data=$query->queryTable("
		SELECT *
		FROM ngs_createdtables
		WHERE owner_id = " . $_SESSION['uid']
		);
}
else if ($p == 'createNewTable')
{
	if (isset($_GET['search'])){$search = $_GET['search'];}
	if (isset($_GET['name'])){$name = $_GET['name'];}
	if (isset($_GET['file'])){$file = $_GET['file'];}
	
	$current_tables=json_decode($query->queryTable("
		SELECT *
		FROM ngs_createdtables
		WHERE owner_id = " . $_SESSION['uid']
		));
	
	$table_check = false;
	$id = '';
	foreach($current_tables as $ct){
		if ($ct->parameters == $search){
			$table_check = true;
			$id = $ct->id;
		}
	}
	
	if($table_check == false){
		$handle = popen('pwd', "r");
		$read = fread($handle, 2096);
		echo $read;
		pclose($handle);
		
		$data=$query->runSQL("
		INSERT ngs_createdtables
		(`name`,`parameters`,`file`,`owner_id`,`perms`,`date_created`,`date_modified`,`last_modified_user`)
		VALUES
		( '$name', '$search','$file', ".$_SESSION['uid'].",3,NOW(),NOW(), ".$_SESSION['uid'].")"
		);
	}else{
		$data=$query->runSQL("
		UPDATE ngs_createdtables
		SET name = '$name'
		WHERE id = $id
		");
		
		$handle = popen('rm ../tmp/files/'.$file, "r");
		pclose($handle);
	}
}
else if ($p == 'deleteTable')
{
	if (isset($_GET['id'])){$id = $_GET['id'];}
	$file=$query->queryTable("
		SELECT file FROM ngs_createdtables
		WHERE id = $id
		");
	$data=json_decode($file);
	
	$handle = popen('rm ../tmp/files/'.$file[0]->file, "r");
	pclose($handle);
	
	$data=$query->runSQL("
		DELETE FROM ngs_createdtables
		WHERE id = $id
		");
}
else if ($p == 'createTableFile')
{
	if (isset($_GET['url'])){$url = $_GET['url'];}
	$json = file_get_contents($url);
	$user = $_SESSION['user'].'_'.date('Y-m-d-H-i-s').'.json2';
	
	$file = fopen('../tmp/files/'.$user, "w");
	fwrite($file,$json);
	fclose($file);
	
	$data = json_encode($user);
}
else if ($p == 'convertToTSV')
{
	if (isset($_GET['url'])){$url = $_GET['url'];}
	var_dump($url);
	#$json_data = file_get_contents($url);
	#var_dump($json_data);
}

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo $data;
exit;
?>