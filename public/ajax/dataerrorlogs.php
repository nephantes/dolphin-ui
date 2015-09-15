<?php
error_reporting(E_ALL);
ini_set('report_errors','on');

require_once("../../config/config.php");
require_once("../../includes/dbfuncs.php");

if (isset($_GET['p'])){$p = $_GET['p'];}
if (isset($_GET['run_id'])){$id = $_GET['run_id'];}

$query = new dbfuncs();

if($p == 'getStdOut'){
	$data = array_slice(str_replace("\n", "<br>", file('../../tmp/logs/run'.$id.'/run.'.$id.'.wrapper.std')), -20);	
}else if($p == 'checkQueued'){
	$data = [];
	$pids = json_decode($query->queryTable("
	SELECT wrapper_pid, runworkflow_pid, wkey
	FROM ngs_runparams
	WHERE id = $id
	"));
	
	$workflow_pid = $pids[0]->runworkflow_pid;
	$wrapper_pid = $pids[0]->wrapper_pid;
	
	$grep_find_workflow = popen( "ps -ef | grep '[".substr($workflow_pid, 0, 1)."]".substr($workflow_pid,1)."'", "r" );
	$grep_find_wrapper = popen( "ps -ef | grep '[".substr($wrapper_pid, 0, 1)."]".substr($wrapper_pid,1)."'", "r" );

	$workflow = fread($grep_find_workflow, 2096);
	$wrapper = fread($grep_find_wrapper, 2096);
	
	pclose($grep_find_workflow);
	pclose($grep_find_wrapper);
	
	if($workflow != ""){
		array_push($data, '1');
	}else{
		array_push($data, '0');
	}
	
	if($wrapper != ""){
		array_push($data, '1');
	}else{
		array_push($data, '0');
	}

	array_push($data, $pids[0]->wkey);
}


header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo json_encode($data);
exit;
