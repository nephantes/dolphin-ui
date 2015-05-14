<?php
//error_reporting(E_ERROR);
error_reporting(E_ALL);
ini_set('report_errors','on');

require_once("../../config/config.php");
require_once("../../includes/dbfuncs.php");

$query = new dbfuncs();
//header

if (isset($_POST['p'])){$p = $_POST['p'];}

if (isset($_POST['start'])){$start = $_POST['start'];}
if (isset($_POST['end'])){$end = $_POST['end'];}

if ($p == "submitPipeline" )
{
	//Grab the inputs
	if (isset($_POST['json'])){$json = $_POST['json'];}
	if (isset($_POST['outdir'])){$outdir = $_POST['outdir'];}
	if (isset($_POST['name'])){$name = $_POST['name'];}
	if (isset($_POST['desc'])){$desc = $_POST['desc'];}
	if (isset($_POST['runGroupID'])){$runGroupID = $_POST['runGroupID'];}
    if (isset($_POST['barcode'])){$barcode = $_POST['barcode'];}
    if (isset($_POST['uid'])){$uid = $_POST['uid'];}
    if (isset($_POST['gids'])){$gids = $_POST['gids'];}
    
	//run_group_id set to -1 as a placeholder.Cannot grab primary key as it's being made, so a placeholder is needed.
	$data=$query->runSQL("
	INSERT INTO biocore.ngs_runparams (run_group_id, outdir, run_status, barcode, json_parameters, run_name, run_description,
    owner_id, group_id, perms, date_created, date_modified, last_modified_user)
	VALUES (-1, '$outdir', 0, $barcode, '$json', '$name', '$desc',
    $uid, NULL, 3, now(), now(), $uid)");
	//need to grab the id for runlist insertion
        $idKey=$query->queryAVal("SELECT id FROM biocore.ngs_runparams WHERE run_group_id = -1 and run_name = '$name' order by id desc limit 1");
        $cmd = "cd ../../scripts && python dolphin_wrapper.py -r $idKey 2>&1 >> ../tmp/run.log &";
        pclose(popen( $cmd, "r"));
	//update required to make run_group_id equal to it's primary key "id".Replace the arbitrary -1 with the id
	if (isset($_POST['runid'])){$runGroupID = $_POST['runid'];}
	if( $runGroupID == 'new'){
		$data=$query->runSQL("UPDATE biocore.ngs_runparams SET run_group_id = id WHERE run_group_id = -1");
	}else{
		$data=$query->runSQL("UPDATE biocore.ngs_runparams SET run_group_id = $runGroupID WHERE run_group_id = -1");
		$idKey= $idKey - $runGroupID;
	}
	$data=$idKey;
}
else if ($p == 'insertRunlist')
{
	//Grab the inputs
	if (isset($_POST['sampID'])){$sampID = $_POST['sampID'];}
	if (isset($_POST['runID'])){$runID = $_POST['runID'];}
    if (isset($_POST['uid'])){$uid = $_POST['uid'];}
    if (isset($_POST['gids'])){$gids = $_POST['gids'];}

	$searchQuery = "INSERT INTO ngs_runlist
		(run_id, sample_id, owner_id, group_id, perms, date_created, date_modified, last_modified_user)
		VALUES ";
	foreach ($sampID as $s){
				$searchQuery .= "($runID, $s, $uid, NULL, 3, NOW(), NOW(), $uid)";
				if($s != end($sampID)){
					$searchQuery .= ",";
				}
			}
	$data=$query->runSQL($searchQuery);
}

//footer
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo $data;
exit;
?>
