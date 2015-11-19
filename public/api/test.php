<?php
$data="as";
require_once("../../config/config.php");
$data=JOB_STATUS;
require_once("funcs.php");
error_reporting(E_ALL);
ini_set('report_errors','on');

$myClass = new funcs();

$result=$myClass->startService("step1", "khAO8pFxKzigjtrMyk1M660xKOG6j", "ls -l");
#$result=$myClass->startService("step1", "khAO8pFxKzigjtrMyk1M660xKOG6j", "ls -l");

#$result=$myClass->getINI();
#$result=json_encode($result);
$data = $result;

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo $data;
exit;

