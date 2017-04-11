<?php

require_once("../../config/config.php");
require_once("../../includes/dbfuncs.php");
                                        
//Metadata submission                   
include(REQUESTS.'/library/Requests.php');
Requests::register_autoloader(); 

$headers = array('Content-Type' => 'application/json', 'Accept' => 'application/json');
$server_start = ENCODE_URL;
$server_end = "/";
$auth = array('auth' => array(ENCODE_ACCESS, ENCODE_SECRET));
#$url = $server_start . $json_name . "/" . $acc . $server_end;
$acc = "TSTFF433829";
$url = $server_start . 'file' . "/" . $acc . $server_end;
echo "<BR>URL:<BR>";
print_r($url);
echo "<BR>"; 
$data =  array( "dataset" => "ENCSR740ROX",
                 "replicate" => "/replicates/c7f6a50f-6c2f-49e8-993a-4fc3c7ec931c/",
                 "file_size" => 1515485930,
                 "md5sum" => "f127a914bdb1b8a6b4c68f2b0847c771",
                 "platform" => "ENCODE:NextSeq500",
                 "submitted_file_name" => "F33_MDDC_H3K27ac_Lps_1h.bam",
                 "lab" => "manuel-garber",
                 "award" => "U01HG007910",
                 "flowcell_details" => array ( array("machine" => "NB501205") , array("flowcell" => "HCFYGAFXX"), array("lane" => "1" )),
                 "output_type" => "alignments",
                 "file_format" => "bam",
                 "assembly" => "hg19",
                 "aliases" => array ("manuel-garber:bam_F33_MDDC_H3K27ac_Lps_1h_1" ),
                 "step_run" => "manuel-garber:chip_pipeline_fastq_alignment_step_run");


echo "<BR>DATA:<BR>";
print_r($data);
echo "<BR>";   
$data = json_encode($data);
echo "<BR>encode:<BR>";
print_r($data);
echo "<BR>";

$response = Requests::patch($url, $headers, $data, $auth);
$body = json_decode($response->body);

echo "<BR>BODY:<BR>";
print_r($body);
echo "<BR>";                             
