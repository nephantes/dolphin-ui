<?php
//error_reporting(E_ERROR);
error_reporting(E_ALL);
ini_set('report_errors','on');

require_once("../../config/config.php");
require_once("../../includes/dbfuncs.php");
if (!isset($_SESSION) || !is_array($_SESSION)) session_start();
$query = new dbfuncs();

$p = '';
$normalized = ['facility', 'source', 'organism', 'molecule', 'lab', 'organization', 'genotype', 'library_type',
				  'biosample_type', 'instrument_model', 'treatment_manufacturer'];

if (isset($_GET['p'])){$p = $_GET['p'];}

if($p == 'updateDatabase')
{

	if (isset($_GET['id'])){$id = $_GET['id'];}
	if (isset($_GET['type'])){$type = $_GET['type'];}
	if (isset($_GET['table'])){$table = $_GET['table'];}
	if (isset($_GET['value'])){$value = $_GET['value'];}
	
	if(in_array($type, $normalized)){
		$type_list = json_decode($query->queryTable("SELECT id FROM ngs_".$type." WHERE $type = '$value'"));
		if($type_list != array()){
			if ($type == 'organization'){
				if(isset(json_decode($query->queryTable("SELECT lab_id FROM ngs_experiment_series WHERE id = $id"))[0]->lab_id)){
					$lab = json_decode($query->queryTable("SELECT lab FROM ngs_experiment_series LEFT JOIN ngs_lab ON ngs_experiment_series.lab_id = ngs_lab.id WHERE ngs_experiment_series.id = $id"));
					$query->runSQL("INSERT INTO ngs_organization ($type) VALUES ('$value')");
					$org_id = json_decode($query->queryTable("SELECT id FROM ngs_organization WHERE $type = '$value'"));
					$data=$query->runSQL("UPDATE ngs_lab SET lab = '".$lab[0]->lab."', organization_id = ".$org_id[0]->id);
				}else{
					$data=0;
				}
			}else{
				$data=$query->runSQL("UPDATE $table SET ".$type."_id = ".$type_list[0]->id." WHERE id = $id"); 	
			}
		}else{
			if ($type == 'organization'){
				$query->runSQL("INSERT INTO ngs_".$type." ($type) VALUES ('$value')");
				$insert_id= json_decode($query->queryTable("SELECT id FROM ngs_".$type." WHERE $type = '$value'"));
				$data=$query->runSQL("UPDATE $table SET ".$type."_id = '".$insert_id[0]->id."' WHERE id = $id");
			}else{
				$query->runSQL("INSERT INTO ngs_".$type." ($type) VALUES ('$value')");
				$insert_id= json_decode($query->queryTable("SELECT id FROM ngs_".$type." WHERE $type = '$value'"));
				$data=$query->runSQL("UPDATE $table SET ".$type."_id = '".$insert_id[0]->id."' WHERE id = $id");
			}
		}	
	}else{
		$data=$query->runSQL("UPDATE $table SET ".$table.".".$type." = '$value' WHERE id = $id"); 	
	}
}
else if($p == 'checkPerms')
{
	if (isset($_GET['id'])){$id = $_GET['id'];}
	if (isset($_GET['uid'])){$uid = $_GET['uid'];}
	if (isset($_GET['table'])){$table = $_GET['table'];}
	
	$owner_id = json_decode($query->queryTable("SELECT owner_id FROM $table WHERE id = $id"));
	if($owner_id[0]->owner_id == $uid){
		$data = 1;
	}else{
		$data = 0;
	}
}
else if($p == 'getDropdownValues')
{
	if (isset($_GET['type'])){$type = $_GET['type'];}
	$data=$query->queryTable("SELECT $type FROM ngs_".$type);
}
else if($p == 'getLanePermissions')
{
	if (isset($_GET['lanes'])){$lanes = $_GET['lanes'];}
	$data=$query->queryTable("SELECT id FROM ngs_lanes WHERE id IN ($lanes) AND owner_id = ".$_SESSION['uid']);
}
else if($p == 'getSamplePermissions')
{
	if (isset($_GET['samples'])){$samples = $_GET['samples'];}
	$data=$query->queryTable("SELECT id FROM ngs_samples WHERE id IN ($samples) AND owner_id = ".$_SESSION['uid']);
}
else if($p == 'deleteSelected')
{
	if (isset($_GET['samples'])){$samples = $_GET['samples'];}
	if (isset($_GET['lanes'])){$lanes = $_GET['lanes'];}
	
	//	LANES
	$query->runSQL("DELETE FROM ngs_temp_lane_files WHERE lane_id IN ($lanes)");
	$query->runSQL("DELETE FROM ngs_lanes WHERE id IN ($lanes)");
	$query->runSQL("DELETE FROM ngs_samples WHERE lane_id IN ($lanes)");
	$query->runSQL("DELETE FROM ngs_fastq_files WHERE lane_id IN ($lanes)");
	
	//	SAMPLES
	$query->runSQL("DELETE FROM ngs_samples WHERE id IN ($samples)");
	$query->runSQL("DELETE FROM ngs_temp_sample_files WHERE sample_id IN ($samples)");
	$query->runSQL("DELETE FROM ngs_sample_conds WHERE sample_id IN ($samples)");
	$query->runSQL("DELETE FROM ngs_fastq_files WHERE sample_id IN ($samples)");
}

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo $data;
exit;
?>