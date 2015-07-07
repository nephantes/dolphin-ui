<?php
//error_reporting(E_ERROR);
error_reporting(E_ALL);
ini_set('report_errors','on');

require_once("../../config/config.php");
require_once("../../includes/dbfuncs.php");
if (!isset($_SESSION) || !is_array($_SESSION)) session_start();
$query = new dbfuncs();

$pDictionary = ['getSelectedSamples', 'submitPipeline', 'getStatus', 'getRunSamples', 'grabReload', 'getReportNames', 'lanesToSamples',
				'checkMatePaired', 'getAllSampleIds', 'getLaneIdFromSample', 'getSingleSample', 'getSeriesIdFromLane', 'getAllLaneIds',
                'getGIDs', 'getSampleNames', 'getWKey', 'getFastQCBool', 'getReportList', 'getTSVFileList', 'profileLoad',
                'obtainAmazonKeys', 'checkAmazonPermissions', 'getInfoBoxData', 'getSamplesFromName', 'getLanesWithSamples'];

$data = "";
                
$q = "";
$r = "";
$seg = "";
$search = "";
$uid = "";
$gids = "";
$perms = "";
$andPerms = "";

if (isset($_GET['p'])){$p = $_GET['p'];}
if (isset($_GET['q'])){$q = $_GET['q'];}
if (isset($_GET['r'])){$r = $_GET['r'];}
if (isset($_GET['seg'])){$seg = $_GET['seg'];}
if (isset($_GET['search'])){$search = $_GET['search'];}

if (isset($_GET['uid'])){$uid = $_GET['uid'];}
if (isset($_GET['gids'])){$gids = $_GET['gids'];}
if($uid != "" && $gids != ""){
    $perms = "WHERE (((group_id in ($gids)) AND (perms >= 15)) OR (owner_id = $uid))";
    $andPerms = "AND (((group_id in ($gids)) AND (perms >= 15)) OR (owner_id = $uid))";
}

$innerJoin = "LEFT JOIN ngs_source
                ON ngs_samples.source_id = ngs_source.id
                LEFT JOIN ngs_organism
                ON ngs_samples.organism_id = ngs_organism.id
                LEFT JOIN ngs_molecule
                ON ngs_samples.molecule_id = ngs_molecule.id
                LEFT JOIN ngs_genotype
                ON ngs_samples.genotype_id = ngs_genotype.id
                LEFT JOIN ngs_library_type
                ON ngs_samples.library_type_id = ngs_library_type.id";
                
$sampleJoin = "LEFT JOIN ngs_fastq_files
                ON ngs_samples.id = ngs_fastq_files.sample_id";
                
$laneJoin = "LEFT JOIN ngs_facility
                ON ngs_lanes.facility_id = ngs_facility.id";

if (isset($_GET['start'])){$start = $_GET['start'];}
if (isset($_GET['end'])){$end = $_GET['end'];}

//make the q val proper for queries
if($q == "Assay"){ $q = "library_type"; }
else { $q = strtolower($q); }

if($search != "" && !in_array($p, $pDictionary)){
	//Prepare search query
	$searchQuery = "";
	$splt = explode("$", $search);
	foreach ($splt as $s){
		$queryArray = explode("=", $s);
        if(sizeof($queryArray) == 2){
            $spltTable = $queryArray[0];
            $spltValue = $queryArray[1];
            $searchQuery .= "$spltTable = \"$spltValue\"";
            if($s != end($splt)){
                $searchQuery .= " AND ";
            }
        }
	}
    
	//browse (search included)
	if($seg == "browse")
	{
		if($p == "getLanes")
		{
			$time="";
			if (isset($start)){$time="WHERE `date_created`>='$start' and `date_created`<='$end'";}
			$data=$query->queryTable("
			SELECT ngs_lanes.id,name, facility, total_reads, total_samples
			FROM biocore.ngs_lanes
            $laneJoin
			WHERE biocore.ngs_lanes.id
			IN (SELECT biocore.ngs_samples.lane_id FROM biocore.ngs_samples $innerJoin WHERE $searchQuery) $andPerms $time
			");
		}
		else if($p == "getSamples")
		{
			$time="";
			if (isset($start)){$time="and `date_created`>='$start' and `date_created`<='$end'";}
			$data=$query->queryTable("
			SELECT ngs_samples.id, name, samplename, title, source, organism, molecule, total_reads
			FROM biocore.ngs_samples
            $innerJoin
            $sampleJoin
			WHERE $searchQuery
            AND (((ngs_samples.group_id in ($gids)) AND (ngs_samples.perms >= 15)) OR (ngs_samples.owner_id = $uid))
            $time
			");
		}
		else if($p == "getExperimentSeries")
		{
			$time="";
			if (isset($start)){$time="WHERE `date_created`>='$start' and `date_created`<='$end'";}
			$data=$query->queryTable("
			SELECT id, experiment_name, summary, design
			FROM biocore.ngs_experiment_series
			WHERE biocore.ngs_experiment_series.id
			IN (SELECT biocore.ngs_samples.series_id FROM biocore.ngs_samples $innerJoin WHERE $searchQuery) $andPerms $time
			");
		}
	}
	else
	{
		//details (search included)
		if($p == "getLanes" && $q != "")
		{
			$time="";
			if (isset($start)){$time="WHERE `date_created`>='$start' and `date_created`<='$end'";}
			$data=$query->queryTable("
			SELECT ngs_lanes.id,name, facility, total_reads, total_samples
			FROM biocore.ngs_lanes
            $laneJoin
			WHERE biocore.ngs_lanes.id
			IN (SELECT biocore.ngs_samples.lane_id FROM biocore.ngs_samples $innerJoin WHERE $searchQuery)
			AND biocore.ngs_lanes.series_id = $q $andPerms $time
			");
		}
		else if($p == "getSamples" && $r != "")
		{
			$time="";
			if (isset($start)){$time="and `date_created`>='$start' and `date_created`<='$end'";}
			$data=$query->queryTable("
			SELECT ngs_samples.id, name, samplename, title, source, organism, molecule, total_reads
			FROM biocore.ngs_samples
            $innerJoin
            $sampleJoin
			WHERE $searchQuery
			AND biocore.ngs_samples.lane_id = $r
            AND (((ngs_samples.group_id in ($gids)) AND (ngs_samples.perms >= 15)) OR (ngs_samples.owner_id = $uid))
            $time
			");
		}
		else if($p == "getSamples" && $q != "")
		{
			$time="";
			if (isset($start)){$time="and `date_created`>='$start' and `date_created`<='$end'";}
			$data=$query->queryTable("
			SELECT ngs_samples.id, name, samplename, title, source, organism, molecule, total_reads
			FROM biocore.ngs_samples
            $innerJoin
            $sampleJoin
			WHERE $searchQuery
			AND biocore.ngs_samples.series_id = $q 
            AND (((ngs_samples.group_id in ($gids)) AND (ngs_samples.perms >= 15)) OR (ngs_samples.owner_id = $uid))
            $time
			");
		}
		else if($p == "getExperimentSeries")
		{
			$time="";
			if (isset($start)){$time="WHERE `date_created`>='$start' and `date_created`<='$end'";}
			$data=$query->queryTable("
			SELECT id, experiment_name, summary, design
			FROM biocore.ngs_experiment_series
			WHERE biocore.ngs_experiment_series.id
			IN (SELECT biocore.ngs_samples.series_id FROM biocore.ngs_samples WHERE $searchQuery) $andPerms $time
			");
		}
	}
}
else if (!in_array($p, $pDictionary))
{
	//browse (no search)
	if($seg == "browse")
	{
		if($p == "getExperimentSeries")
		{
			$time="";
			if (isset($start)){$time="WHERE `date_created`>='$start' and `date_created`<='$end'";}
			$data=$query->queryTable("
			SELECT id, experiment_name, summary, design
			FROM biocore.ngs_experiment_series
			WHERE biocore.ngs_experiment_series.id
			IN (SELECT biocore.ngs_samples.series_id FROM biocore.ngs_samples $innerJoin WHERE ngs_samples.$q = \"$r\") $andPerms $time
			");
		}
		else if($p == "getLanes")
		{
			$time="";
			if (isset($start)){$time="WHERE `date_created`>='$start' and `date_created`<='$end'";}
			$data=$query->queryTable("
			SELECT ngs_lanes.id,name, facility, total_reads, total_samples
			FROM biocore.ngs_lanes
            $laneJoin
			WHERE biocore.ngs_lanes.id
			IN (SELECT biocore.ngs_samples.lane_id FROM biocore.ngs_samples $innerJoin WHERE biocore.ngs_samples.$q = \"$r\") $andPerms $time
			");
		}
		else if($p == "getSamples")
		{
			$time="";
			if (isset($start)){$time="and `date_created`>='$start' and `date_created`<='$end'";}
			$data=$query->queryTable("
			SELECT ngs_samples.id, name, samplename, title, source, organism, molecule, total_reads
			FROM biocore.ngs_samples
            $innerJoin
            $sampleJoin
			WHERE biocore.ngs_samples.$q = \"$r\"
            AND (((ngs_samples.group_id in ($gids)) AND (ngs_samples.perms >= 15)) OR (ngs_samples.owner_id = $uid))
            $time
			");
		}
		else if($p == "getProtocols")
		{
			$time="";
			if (isset($start)){$time="WHERE `date_created`>='$start' and `date_created`<='$end'";}
			$data=$query->queryTable("
			SELECT id, name, growth, treatment
			FROM biocore.ngs_protocols
			WHERE biocore.ngs_samples.$q = \"$r\" $andPerms $time
			");
		}
	}
	else
	{
		//details (no search)
		if($p == "getLanes" && $q != "")
		{
			$time="";
			if (isset($start)){$time="WHERE `date_created`>='$start' and `date_created`<='$end'";}
			$data=$query->queryTable("
			SELECT ngs_lanes.id,name, facility, total_reads, total_samples
			FROM biocore.ngs_lanes
            $laneJoin
			WHERE biocore.ngs_lanes.series_id = $q $andPerms $time
			");
		}
		else if($p == "getSamples" && $r != "")
		{
			$time="";
			if (isset($start)){$time="and `date_created`>='$start' and `date_created`<='$end'";}
			$data=$query->queryTable("
			SELECT ngs_samples.id, name, samplename, title, source, organism, molecule, total_reads
			FROM biocore.ngs_samples
            $innerJoin
            $sampleJoin
			WHERE biocore.ngs_samples.lane_id = $r
            AND (((ngs_samples.group_id in ($gids)) AND (ngs_samples.perms >= 15)) OR (ngs_samples.owner_id = $uid))
            $time
			");
		}
		else if($p == "getSamples" && $q != "")
		{
			$time="";
			if (isset($start)){$time="and `date_created`>='$start' and `date_created`<='$end'";}
			$data=$query->queryTable("
			SELECT ngs_samples.id, name, samplename, title, source, organism, molecule, total_reads
			FROM biocore.ngs_samples
            $innerJoin
            $sampleJoin
			WHERE biocore.ngs_samples.series_id = $q
            AND (((ngs_samples.group_id in ($gids)) AND (ngs_samples.perms >= 15)) OR (ngs_samples.owner_id = $uid))
            $time
			");
		}
		//index
		else if($p == "getExperimentSeries")
		{
			$time="";
			if (isset($start)){$time="WHERE `date_created`>='$start' and `date_created`<='$end'";}
			$data=$query->queryTable("
			SELECT id, experiment_name, summary, design
			FROM biocore.ngs_experiment_series $perms $time
			");
		}
		else if($p == "getProtocols")
		{
			$time="";
			if (isset($start)){$time="WHERE `date_created`>='$start' and `date_created`<='$end'";}
			$data=$query->queryTable("
			SELECT id, name, growth, treatment
			FROM biocore.ngs_protocols $perms $time
			");
		}

		else if($p == "getLanes")
		{
			$time="";
			if (isset($start)){$time="WHERE `date_created`>='$start' and `date_created`<='$end'";}
			$data=$query->queryTable("
			SELECT ngs_lanes.id,name, facility, total_reads, total_samples
			FROM biocore.ngs_lanes
            $laneJoin
            $perms $time
			");
		}
		else if($p == "getSamples")
		{
			$time="";
			if (isset($start)){$time="and `date_created`>='$start' and `date_created`<='$end'";}
			$data=$query->queryTable("
			SELECT ngs_samples.id, name, samplename, title, source, organism, molecule, total_reads
			FROM biocore.ngs_samples
            $innerJoin
            $sampleJoin
            WHERE (((ngs_samples.group_id in ($gids)) AND (ngs_samples.perms >= 15)) OR (ngs_samples.owner_id = $uid))
            $time
			");
		}
	}
}
else if ($p == "getSelectedSamples")
{

	//Prepare selected sample search query
	$searchQuery = "";
	$splitIndex = ['id','lane_id'];
	$typeCount = 0;
	if (substr($search, 0, 1) == "$"){
		//only lanes selected
		$search = substr($search, 1, strlen($search));
		$splt = explode(",", $search);
		foreach ($splt as $x){
			$searchQuery .= "biocore.ngs_samples.$splitIndex[1] = $x";
			if($x != end($splt)){
				$searchQuery .= " OR ";
			}
		}
	}
	else if(substr($search, strlen($search) - 1, strlen($search)) == "$"){
		//only samples selected
		$search = substr($search, 0, strlen($search) - 1);
		$splt = explode(",", $search);
		foreach ($splt as $x){
			$searchQuery .= "biocore.ngs_samples.$splitIndex[0] = $x";
			if($x != end($splt)){
				$searchQuery .= " OR ";
			}
		}
	}
	else{
		$splt = explode("$", $search);
		foreach ($splt as $s){
			$secondSplt = explode(",", $s);
			foreach ($secondSplt as $x){
				$searchQuery .= "biocore.ngs_samples.$splitIndex[$typeCount] = $x";
				if($x != end($secondSplt)){
					$searchQuery .= " OR ";
				}
			}
			if($s != end($splt)){
					$searchQuery .= " OR ";
			}
			$typeCount = $typeCount + 1;
		}
	}
	$time="";
	if (isset($start)){$time="and `date_created`>='$start' and `date_created`<='$end'";}
	$data=$query->queryTable("
	SELECT ngs_samples.id, name, samplename, title, source, organism, molecule
	FROM biocore.ngs_samples
    $innerJoin
	WHERE $searchQuery $andPerms $time
	");
}
else if ($p =='getStatus')
{
	$time="";
	if (isset($start)){$time="and `date_created`>='$start' and `date_created`<='$end'";}
	$data=$query->queryTable("
	SELECT id, run_group_id, run_name, outdir, run_description, run_status
	FROM biocore.ngs_runparams
	$perms $time
	");
}
else if($p == 'getRunSamples')
{
	//Grab Variables
	if (isset($_GET['runID'])){$runID = $_GET['runID'];}

	$data=$query->queryTable("
	SELECT sample_id
	FROM biocore.ngs_runlist
	WHERE biocore.ngs_runlist.run_id = $runID $andPerms
	");
}
else if ($p == 'grabReload')
{
	//Grab variables
	if (isset($_GET['groupID'])){$groupID = $_GET['groupID'];}

	$data=$query->queryTable("
	SELECT outdir, json_parameters, run_name, run_description
	FROM biocore.ngs_runparams
	WHERE biocore.ngs_runparams.id = $groupID $andPerms
	");
}
else if ($p == 'getReportNames')
{
	if (isset($_GET['runid'])){$runid = $_GET['runid'];}
    if (isset($_GET['samp'])){$samp = $_GET['samp'];}
	$sampleQuery = '';
    $samples = explode(",", $samp);
    
	foreach($samples as $s){
		$sampleQuery.= 'ngs_runlist.sample_id = '+ $s;
		if($s != end($samples)){
			$sampleQuery.= ' OR ';
		}
	}

	$data=$query->queryTable("
		SELECT distinct(ngs_fastq_files.file_name), ngs_runparams.outdir
		FROM ngs_fastq_files, ngs_runparams, ngs_runlist
		WHERE ngs_runlist.sample_id = ngs_fastq_files.sample_id
		AND ngs_runparams.id = ngs_fastq_files.lane_id
			AND ngs_fastq_files.lane_id = $runid
			AND ( $sampleQuery )
            $andPerms;
	");
}
else if ($p == 'lanesToSamples')
{
	if (isset($_GET['lane'])){$lane = $_GET['lane'];}
	$data=$query->queryTable("
		SELECT id
		FROM ngs_samples
		WHERE ngs_samples.lane_id = $lane $andPerms
	");
}
else if ($p == 'getAllSampleIds')
{
	$data=$query->queryTable("
		SELECT id
		FROM ngs_samples $perms
	");
}
else if ($p == 'getAllLaneIds')
{
	$data=$query->queryTable("
		SELECT id
		FROM ngs_lanes $perms
	");
}
else if ($p == 'getLaneIdFromSample')
{
	if (isset($_GET['sample'])){$sample = $_GET['sample'];}
	$data=$query->queryTable("
		SELECT id
		FROM ngs_lanes
		where id =
				(select lane_id
				from ngs_samples
				where ngs_samples.id = $sample)
        $andPerms;
	");
}
else if($p == 'getSingleSample')
{
	if (isset($_GET['sample'])){$sample = $_GET['sample'];}
	$data=$query->queryTable("
		SELECT id, title
		FROM ngs_samples
		where id = $sample $andPerms
	");
}
else if($p == 'getSeriesIdFromLane')
{
	if (isset($_GET['lane'])){$lane = $_GET['lane'];}
	$data=$query->queryTable("
		SELECT series_id
		FROM ngs_lanes
		where id = $lane $andPerms
	");
}
else if ($p == 'checkMatePaired')
{
	if (isset($_GET['runid'])){$runid = $_GET['runid'];}
	$data=$query->queryTable("
		SELECT json_parameters
		FROM ngs_runparams
		where id = $runid $andPerms
	"); 
}
else if ($p == 'getSampleNames')
{
    if (isset($_GET['samples'])){$samples = $_GET['samples'];}
	$data=$query->queryTable("
		SELECT name, samplename
		FROM ngs_samples
		where id in ($samples) $andPerms
	");  
}
else if ($p == 'getWKey')
{
    if (isset($_GET['run_id'])){$run_id = $_GET['run_id'];}
    $data=$query->queryTable("
    SELECT wkey
    FROM ngs_runparams
    WHERE id = $run_id
    ");
}
else if ($p == 'getFastQCBool')
{
    if (isset($_GET['id'])){$id = $_GET['id'];}
    $data=$query->queryTable("
    SELECT json_parameters
    FROM ngs_runparams
    WHERE id = $id
    ");
}
else if ($p == 'getReportList')
{
    if (isset($_GET['wkey'])){$wkey = $_GET['wkey'];}
    $data=$query->queryTable("
    SELECT version, type, file
    FROM report_list
    WHERE wkey = '$wkey'
    ");
}
else if ($p == 'getTSVFileList')
{
    if (isset($_GET['wkey'])){$wkey = $_GET['wkey'];}
    $data=$query->queryTable("
    SELECT file
    FROM report_list
    WHERE wkey = '$wkey' and file like '%.tsv'
    ");
}
else if ($p == 'profileLoad')
{
    $data=$query->queryTable("
    SELECT photo_loc
    FROM users
    WHERE username = '".$_SESSION['user']."'"
    );
}
else if ($p == 'obtainAmazonKeys')
{
    $data=$query->queryTable("
    SELECT * FROM amazon_credentials WHERE id IN(
        SELECT amazon_id FROM group_amazon WHERE id IN(
            SELECT id FROM groups WHERE id IN(
                SELECT g_id FROM user_group WHERE u_id = ".$_SESSION['uid'].")))
    ");
}
else if ($p == 'getInfoBoxData')
{
    if (isset($_GET['fieldname'])){$fieldname = $_GET['fieldname'];}
    $data=$query->queryTable("
    SELECT help_text
    FROM ngs_help
    WHERE field_name = '$fieldname';
    ");
}
else if ($p == 'checkAmazonPermissions')
{
    if (isset($_GET['a_id'])){$a_id = $_GET['a_id'];}
    $data=$query->queryTable("
    SELECT id FROM groups WHERE owner_id = ".$_SESSION['uid']." AND id IN(
    SELECT group_id FROM group_amazon WHERE amazon_id = (
    SELECT DISTINCT id FROM biocore.amazon_credentials where id = $a_id));
    ");
}
else if($p == 'getSamplesFromName')
{
    if (isset($_GET['names'])){$names = $_GET['names'];}
    if (isset($_GET['lane'])){$lane = $_GET['lane'];}
    if (isset($_GET['experiment'])){$experiment = $_GET['experiment'];}
    $names = explode(",", $names);
    $sqlnames = "";
    foreach($names as $n){
        if($n != end($names)){
            $sqlnames.= "'".$n."',";
        }else{
            $sqlnames.= "'".$n."'";    
        }
    }
    $data=$query->queryTable("
    SELECT ns.id
    FROM ngs_samples ns, ngs_lanes nl, ngs_experiment_series ne 
    WHERE ns.name in ($sqlnames)
    AND ns.lane_id = nl.id and nl.name = '$lane'
    AND ns.series_id = ne.id and ne.experiment_name = '$experiment';
    ");
}
else if ($p == 'getLanesWithSamples')
{
    $data=$query->queryTable("
    SELECT ngs_lanes.id
    FROM ngs_lanes
    WHERE ngs_lanes.id in (
        SELECT ngs_samples.lane_id
        FROM ngs_samples
        WHERE id in (
            SELECT ngs_fastq_files.sample_id
            FROM ngs_fastq_files
            WHERE total_reads > 0
        )
    )
    ");
}


header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo $data;
exit;
?>
