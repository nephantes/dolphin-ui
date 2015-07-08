<?php
$data="as";
require_once("funcs.php");
error_reporting(E_ALL);
ini_set('report_errors','on');

$myClass = new funcs();
$result=$myClass->getINI();
$result=json_encode($result);

$data = $result;

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo $data;
exit;

