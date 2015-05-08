<?php
//error_reporting(E_ERROR);
error_reporting(E_ALL);
ini_set('report_errors','on');

require_once("../../config/config.php");
require_once("../../includes/dbfuncs.php");

$query = new dbfuncs();
//header

if (isset($_GET['p'])){$p = $_GET['p'];}
if (isset($_POST['p'])){$p = $_POST['p'];}


if ($p == 'experimentSeriesCheck'){
	if (isset($_GET['name'])){$name = $_GET['name'];}
	$data=$query->queryAVal("
	SELECT id
	FROM ngs_experiment_series
	WHERE experiment_name = '$name';
	");
}else if ($p == 'laneCheck'){
	if (isset($_GET['experiment'])){$experiment = $_GET['experiment'];}
	if (isset($_GET['lane'])){$lane = $_GET['lane'];}
	$data=$query->queryAVal("
	SELECT id
	FROM ngs_lanes
	WHERE series_id = '$experiment' AND name = '$lane';
	");
}else if ($p == 'sampleCheck'){
	if (isset($_GET['experiment'])){$experiment = $_GET['experiment'];}
	if (isset($_GET['lane'])){$lane = $_GET['lane'];}
	if (isset($_GET['sample'])){$sample = $_GET['sample'];}
	$data=$query->queryAVal("
	SELECT id
	FROM ngs_samples
	WHERE series_id = '$experiment' AND lane_id = '$lane' AND name = '$sample';
	");
}else if ($p == 'insertExperimentSeries'){
	if (isset($_POST['name'])){$name = $_POST['name'];}
	$data=$query->runSQL("
	INSERT INTO ngs_experiment_series
		(experiment_name, summary, owner_id, group_id, perms, date_created, date_modified, last_modified_user)
		VALUES ('$name', 'please create an experiment summary', ".$_SESSION['uid'].", 1, 15, now(), now(), ".$_SESSION['uid'].");
	");
}else if ($p == 'insertLane'){
	if (isset($_POST['experiment'])){$experiment = $_POST['experiment'];}
	if (isset($_POST['lane'])){$lane = $_POST['lane'];}
	$data=$query->runSQL("
	INSERT INTO ngs_lanes
		(series_id, name, facility, owner_id, group_id, perms, date_created, date_modified, last_modified_user)
		VALUES ('$experiment', '$lane', 'In house', ".$_SESSION['uid'].", 1, 15, now(), now(), ".$_SESSION['uid'].");
	");
}else if ($p == 'insertSample'){
	if (isset($_POST['experiment'])){$experiment = $_POST['experiment'];}
	if (isset($_POST['lane'])){$lane = $_POST['lane'];}
	if (isset($_POST['sample'])){$sample = $_POST['sample'];}
	if (isset($_POST['organism'])){$organism = $_POST['organism'];}
	if (isset($_POST['barcode'])){$barcode = $_POST['barcode'];}
	$data=$query->runSQL("
	INSERT INTO ngs_samples
		(series_id, lane_id, name, title, barcode, organism,
		owner_id, group_id, perms, date_created, date_modified, last_modified_user)
		VALUES ($experiment, $lane, '$sample', '$sample', '$barcode', '$organism',
		".$_SESSION['uid'].", 1, 15, now(), now(), ".$_SESSION['uid'].");
	");
}

//footer
//header('Cache-Control: no-cache, must-revalidate');
//header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//header('Content-type: application/json');
echo $data;
exit;
?>