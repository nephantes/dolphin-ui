<?php
include('service.php');
error_reporting(E_ALL);
ini_set('report_errors','on');

$myClass = new Pipeline();
$username="svcgalaxy";
$workflow="ChipSeqWorkflow";
$key="b3PIGiDj5xu95kuonZaBWSxk52B";

$data="AAA<BR>";
#$result=$myClass->startWorkflow("~/scratch/workflow/a.txt", $username, $workflow, $key, "~/scratch/out");
#$result=$myClass->getKey();
$result=$myClass->getINI();
$data.="SERVICE<BR>"; 
$data.="RESULT:<BR>[".$result."]<BR>";

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo $data;
exit;

/**
$username="svcgalaxy";
$workflow="ChipSeqWorkflow";
$key="b3PIGiDj5xu95kuonZaBWSxk52B";
$service="service4";
#service1:cYUVd6uCIhnljAMpEoJPQorEjPYitD:sdadsf
#(a=INPUTPARAM , c=DEFAULTPARAM , b=USERNAME , e=wfname, d=WKEY , f=OUTDIR)
#$result=$myClass->checkStatus( $service, $key);
$result=$myClass1->startService($service, $key, "ls -l ;sleep 10");
print "SERVICE<BR>"; 
print "RESULT:<BR>[".$result."]<BR>";
**/
?>
