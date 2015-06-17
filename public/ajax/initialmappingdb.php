<?php
//error_reporting(E_ERROR);
error_reporting(E_ALL);
ini_set('report_errors','on');

require_once("../../config/config.php");
require_once("../../includes/dbfuncs.php");
if (!isset($_SESSION) || !is_array($_SESSION)) session_start();
$query = new dbfuncs();
$data = "";

if (isset($_GET['p'])){$p = $_GET['p'];}

if ($p == 'sampleChecking')
{
	if (isset($_GET['sample_id'])){$sample_id = $_GET['sample_id'];}
	$data=$query->queryTable("
	SELECT id
	FROM ngs_fastq_files
	WHERE sample_id = $sample_id
	");
}

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo $data;
exit;
?>
