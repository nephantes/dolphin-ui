<?php
# PATCH an object to an ENCODE server
require_once("../../config/config.php");
if (isset($_GET['json_name'])){$json_name = $_GET['json_name'];}
if (isset($_GET['json_passed'])){$json_passed = $_GET['json_passed'];}
if (isset($_GET['accession'])){$accession = $_GET['accession'];}

$accs = explode(",", $accession);
$server_start = ENCODE_URL;
$server_end = "/";
if(!isset($_SESSION['encode_log'])){
	$_SESSION['encode_log'] = "../../tmp/encode/".$_SESSION['user']."_".date('Y-m-d-H-i-s').".log";
}
#print "[".$_SESSION['encode_log']."]";
$logloc = $_SESSION['encode_log'];
$logfile = fopen($logloc, "a") or die("Unable to open file!");

#Uses Requests library from https://github.com/rmccue/Requests
include(REQUESTS.'/library/Requests.php');
Requests::register_autoloader();

# Force return from the server in JSON format
$headers = array('Content-Type' => 'application/json', 'Accept' => 'application/json');

# Authentication is always required to POST ENCODE objects
$authid = ENCODE_ACCESS;
$authpw = ENCODE_SECRET;
$auth = array('auth' => array($authid, $authpw));

$json = $json_passed;

#Cycle through array and post objects
$count = 0;
foreach ($accs as $acc) {
	if($acc != null){
		if(isset($json[$count]['amount'])){
			$json[$count]['amount'] = intval($json[$count]['amount']);
		}
		if(isset($json[$count]['duration'])){
			$json[$count]['duration'] = intval($json[$count]['duration']);
		}
		if(isset($json[$count]['biological_replicate_number'])){
			$json[$count]['biological_replicate_number'] = intval($json[$count]['biological_replicate_number']);
		}
		if(isset($json[$count]['technical_replicate_number'])){
			$json[$count]['technical_replicate_number'] = intval($json[$count]['technical_replicate_number']);
		}
		if(isset($json[$count]['starting_amount'])){
				$json[$count]['starting_amount'] = intval($json[$count]['starting_amount']);
		}
		# The URL is now the collection itself
		fwrite($logfile, "PATCH: SERVER_START: [$server_start]\n");
		fwrite($logfile, "PATCH: JSON_NAME: [$json_name]\n");
		fwrite($logfile, "PATCH: ACC: [$acc]\n");
		fwrite($logfile, "PATCH: SERVER_END: [$server_end]\n");
		fwrite($logfile, "PATCH: JSON: \n\n[\n ".json_encode($json)." \n]\n");

				
		$url = $server_start . $json_name . "/" . $acc . $server_end;
		$response = Requests::patch($url, $headers, json_encode($json[$count]), $auth);
		$count++;
		if(count($json) == $count){
			echo $response->body;
		}else{
			echo $response->body . ",";	
		}
		
		fwrite($logfile, "PATCH $json_name\n" . $response->body . "\n\n");
	}
}
fclose($logfile);
?>
