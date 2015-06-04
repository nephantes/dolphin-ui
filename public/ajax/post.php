<?php
# POST an object to an ENCODE server

$access_key;
$secret_access_key;
$server_start = "https://ggr-testing.demo.encodedcc.org/"
$server_end = "/";

#Uses Requests library from https://github.com/rmccue/Requests
include('../../../Requests/library/Requests.php');
Requests::register_autoloader();

# Force return from the server in JSON format
$headers = array('Content-Type' => 'application/json', 'Accept' => 'application/json');

# Authentication is always required to POST ENCODE objects
$authid = "access_key"; // <-Replace this with your access_key
$authpw = "secret_access_key"; // <-Replace this with your secret_access_key
$auth = array('auth' => array($authid, $authpw));

# Arguments at comand line, file to post and object
$jsonfile = $argv[1];
$object = $argv[2];

# The URL is now the collection itself
$url = $server_start. $object . $server_end; // <-Replace this with appropriate server

$json = json_decode(file_get_contents($jsonfile));

#Cycle through array and post objects
foreach ($json as $json_object) {
	#POST the JSON and get back response
	$response = Requests::post($url, $headers, json_encode($json_object), $auth);
	# If the POST succeeds, the response is the new object in JSON format
	var_dump($response->body);
}


?>