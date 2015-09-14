<?php
error_reporting(E_ALL);
ini_set('report_errors','on');

require_once("../../config/config.php");
require_once("../../includes/dbfuncs.php");

$id = $_GET['run_id'];
$query = new dbfuncs();

$data = array_slice(str_replace("\n", "<br>", file('../../tmp/logs/run'.$id.'/run.'.$id.'.wrapper.std')), -20);

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo json_encode($data);
exit;
