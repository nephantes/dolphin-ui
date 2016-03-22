<?php
//error_reporting(E_ERROR);
error_reporting(E_ALL);
ini_set('report_errors','on');

require_once("../../config/config.php");
require_once("../../includes/dbfuncs.php");
require_once("../api/funcs.php");
if (!isset($_SESSION) || !is_array($_SESSION)) session_start();
$query = new dbfuncs();
$funcs = new funcs();

if (isset($_GET['p'])){$p = $_GET['p'];}

if ($p == "resetService")
{
	if (isset($_GET['run_id'])){$run_id = $_GET['run_id'];}
	if (isset($_GET['s_id'])){$s_id = $_GET['s_id'];}
	if (isset($_GET['wkey'])){$wkey = $_GET['wkey'];}
	if (isset($_GET['name'])){$name = $_GET['name'];}
	if (isset($_GET['type'])){$type = $_GET['type'];}

	if($type == 'hard'){
		$outdir=$query->queryAVal("
		SELECT outdir
		FROM ngs_runparams
		WHERE id = $run_id
		");
		$remove_out = $funcs->removeSuccessFile($wkey, $outdir, $name);
	}
	$data=$query->runSQL("
	DELETE FROM jobs
	WHERE wkey = '$wkey'
	AND service_id = (
		SELECT service_id
		FROM service_run
		WHERE wkey = '$wkey'
		AND service_run_id = $s_id
		)
	");
	$data=$query->runSQL("
	DELETE FROM service_run
	WHERE wkey = '$wkey'
	AND service_run_id = $s_id
	");
}
else if ($p == 'resetJob')
{
	if (isset($_GET['run_id'])){$run_id = $_GET['run_id'];}
	if (isset($_GET['s_id'])){$s_id = $_GET['s_id'];}
	if (isset($_GET['wkey'])){$wkey = $_GET['wkey'];}
	if (isset($_GET['name'])){$name = $_GET['name'];}
	if (isset($_GET['type'])){$type = $_GET['type'];}
	
	if($type == 'hard'){
		$outdir=$query->queryAVal("
		SELECT outdir
		FROM ngs_runparams
		WHERE id = $run_id
		");
		$remove_out = $funcs->removeSuccessFile($wkey, $outdir, $name);
	}
	$data=$query->runSQL("
	DELETE FROM jobs
	WHERE wkey = '$wkey'
	AND jobname = '$name'
	");
}
if (!headers_sent()) {
   header('Cache-Control: no-cache, must-revalidate');
   header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
   header('Content-type: application/json');
   echo $data;
   exit;
}else{
   echo $data;
}
?>