<?php
error_reporting(E_ALL);
ini_set('report_errors','on');

require_once("../../config/config.php");
require_once("../../includes/dbfuncs.php");

$query = new dbfuncs();
$data = array();
$wkey = $_GET['wkey'];

$service = json_decode($query->queryTable('
SELECT CONCAT("id_", CAST(sr.service_run_id AS CHAR)) id, sr.service_run_id num,  s.servicename title,
 TIME_TO_SEC(timediff(sr.end_time, sr.start_time)) duration, sp.percentComplete, sr.start_time start, sr.end_time finish, sr.result result
  FROM workflow_run wr, service_run sr, services s,
(Select a.service_run_id, (jobFinished/jobCount)*100 percentComplete
FROM
(SELECT s.service_run_id, count(j.job_id) jobCount
FROM service_run s, workflow_run w, jobs j 
where j.wkey=w.wkey and j.wkey=s.wkey and j.wkey=s.wkey and w.wkey="'.$wkey.'"
group by s.service_run_id) a,
(SELECT s.service_run_id, count(j.job_id) jobFinished
FROM service_run s, workflow_run w, jobs j 
where j.wkey=w.wkey and j.wkey=s.wkey and j.wkey=s.wkey and w.wkey="'.$wkey.'"
group by s.service_run_id) b
where a.service_run_id=b.service_run_id) sp
  where sr.wkey=wr.wkey and s.service_id=sr.service_id and sp.service_run_id=sr.service_run_id 
  and wr.wkey="'.$wkey.'" order by sr.start_time;
'));

foreach($service as $s){
	$current_service = array();
	$service_job = json_decode($query->queryTable('
	Select CONCAT("id_", CAST(j.job_id AS CHAR)) id, j.job_id num, jobname title,
	j.job_num, TIME_TO_SEC(timediff(j.end_time, j.start_time)) duration, 
	 j.result result, submit_time submit, j.start_time start, j.end_time finish from 
	jobs j, service_run sr where sr.wkey=j.wkey and sr.service_id=j.service_id and j.jobstatus=1 and sr.service_run_id='.substr($s->id,3).'
	order by start;
	'));
	
	$count = 0;
	$finished = 0;
	$bartype = "progress-bar-striped";
	$barcolor = "yellow";
	foreach ($service_job as $sj){
		$count++;
		if($sj->result == '3'){
			$finished++;
		}else if($sj->result == '0'){
			$barcolor = "red";
			$bartype = "";
		}
	}
	if($count == $finished){
		$bartype = "";
		$barcolor = "green";
	}
	array_push($data, array(substr($s->id,3), $count, $finished, $bartype, $barcolor));
}
$data = json_encode($data);

if (!headers_sent()) {
   header('Cache-Control: no-cache, must-revalidate');
   header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
   header('Content-type: application/json');
   echo $data;
   exit;
}else{
   echo $data;
}
