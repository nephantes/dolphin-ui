<?php
//error_reporting(E_ERROR);
error_reporting(E_ALL);
ini_set('report_errors','on');

require_once("../../config/config.php");
require_once("../../includes/dbfuncs.php");

$query = new dbfuncs();

if (isset($_GET['p'])){$p = $_GET['p'];}
if (isset($_GET['q'])){$q = $_GET['q'];}
if (isset($_GET['r'])){$r = $_GET['r'];}
if (isset($_GET['seg'])){$seg = $_GET['seg'];}
if (isset($_GET['search'])){$search = $_GET['search'];}
if (isset($_GET['start'])){$start = $_GET['start'];}
if (isset($_GET['end'])){$end = $_GET['end'];}

if (isset($_POST['p'])){$p = $_POST['p'];}

//make the q val proper for queries
if($q == "Assay"){ $q = "library_type"; }
else { $q = strtolower($q); }

if($search != "" && $p != 'getSelectedSamples' && $p != 'submitPipeline'){
    //Prepare search query
    $searchQuery = "";
    $splt = explode("$", $search);
    foreach ($splt as $s){
        $queryArray = explode("=", $s);
        $spltTable = $queryArray[0];
        $spltValue = $queryArray[1];
        $searchQuery .= "biocore.ngs_samples.$spltTable = \"$spltValue\"";
        if($s != end($splt)){
            $searchQuery .= " AND ";
        }
    }
    //browse (search incnluded)
    if($seg == "browse")
    {    
        if($p == "getLanes")
        {
            $time="";
            if (isset($start)){$time="WHERE `date_created`>='$start' and `date_created`<='$end'";}
            $data=$query->queryTable("
            SELECT id,  name, facility, total_reads, total_samples
            FROM biocore.ngs_lanes
            WHERE biocore.ngs_lanes.id
            IN (SELECT biocore.ngs_samples.lane_id FROM biocore.ngs_samples WHERE $searchQuery) $time
            ");
        }
        else if($p == "getSamples")
        {
            $time="";
            if (isset($start)){$time="and `date_created`>='$start' and `date_created`<='$end'";}
            $data=$query->queryTable("
            SELECT id, title, source, organism, molecule
            FROM biocore.ngs_samples
            WHERE $searchQuery $time
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
            IN (SELECT biocore.ngs_samples.series_id FROM biocore.ngs_samples WHERE $searchQuery) $time
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
            SELECT id,  name, facility, total_reads, total_samples
            FROM biocore.ngs_lanes
            WHERE biocore.ngs_lanes.id 
            IN (SELECT biocore.ngs_samples.lane_id FROM biocore.ngs_samples WHERE $searchQuery)
            AND biocore.ngs_lanes.series_id = $q $time
            ");
        }
        else if($p == "getSamples" && $r != "")
        {
            $time="";
            if (isset($start)){$time="and `date_created`>='$start' and `date_created`<='$end'";}
            $data=$query->queryTable("
            SELECT id, title, source, organism, molecule
            FROM biocore.ngs_samples
            WHERE $searchQuery
            AND biocore.ngs_samples.lane_id = $r $time
            ");
        }
        else if($p == "getSamples" && $q != "")
        {
            $time="";
            if (isset($start)){$time="and `date_created`>='$start' and `date_created`<='$end'";}
            $data=$query->queryTable("
            SELECT id, title, source, organism, molecule
            FROM biocore.ngs_samples
            WHERE $searchQuery
            AND biocore.ngs_samples.series_id = $q $time
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
            IN (SELECT biocore.ngs_samples.series_id FROM biocore.ngs_samples WHERE $searchQuery) $time
            ");
        }
    }
}
else if ($p != "getSelectedSamples")
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
            IN (SELECT biocore.ngs_samples.series_id FROM biocore.ngs_samples WHERE ngs_samples.$q = \"$r\") $time
            ");
        }
        else if($p == "getLanes")
        {
            $time="";
            if (isset($start)){$time="WHERE `date_created`>='$start' and `date_created`<='$end'";}
            $data=$query->queryTable("
            SELECT id,  name, facility, total_reads, total_samples
            FROM biocore.ngs_lanes
            WHERE biocore.ngs_lanes.id
            IN (SELECT biocore.ngs_samples.lane_id FROM biocore.ngs_samples WHERE biocore.ngs_samples.$q = \"$r\") $time
            ");
        }
        else if($p == "getSamples")
        {
            $time="";
            if (isset($start)){$time="and `date_created`>='$start' and `date_created`<='$end'";}
            $data=$query->queryTable("
            SELECT id, title, source, organism, molecule
            FROM biocore.ngs_samples
            WHERE biocore.ngs_samples.$q = \"$r\" $time
            ");
        }
        else if($p == "getProtocols")
        {
            $time="";
            if (isset($start)){$time="WHERE `date_created`>='$start' and `date_created`<='$end'";}
            $data=$query->queryTable("
            SELECT id, name, growth, treatment
            FROM biocore.ngs_protocols 
            WHERE biocore.ngs_samples.$q = \"$r\" $time
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
            SELECT id,  name, facility, total_reads, total_samples
            FROM biocore.ngs_lanes
            WHERE biocore.ngs_lanes.series_id = $q $time
            ");
        }
        else if($p == "getSamples" && $r != "")
        {
            $time="";
            if (isset($start)){$time="and `date_created`>='$start' and `date_created`<='$end'";}
            $data=$query->queryTable("
            SELECT id, title, source, organism, molecule
            FROM biocore.ngs_samples
            WHERE biocore.ngs_samples.lane_id = $r $time
            ");
        }
        else if($p == "getSamples" && $q != "")
        {
            $time="";
            if (isset($start)){$time="and `date_created`>='$start' and `date_created`<='$end'";}
            $data=$query->queryTable("
            SELECT id, title, source, organism, molecule
            FROM biocore.ngs_samples
            WHERE biocore.ngs_samples.series_id = $q $time
            ");
        }
        //index
        else if($p == "getExperimentSeries")
        {
            $time="";
            if (isset($start)){$time="WHERE `date_created`>='$start' and `date_created`<='$end'";}
            $data=$query->queryTable("
            SELECT id, experiment_name, summary, design
            FROM biocore.ngs_experiment_series $time
            ");
        }
        else if($p == "getProtocols")
        {
            $time="";
            if (isset($start)){$time="WHERE `date_created`>='$start' and `date_created`<='$end'";}
            $data=$query->queryTable("
            SELECT id, name, growth, treatment
            FROM biocore.ngs_protocols $time
            ");
        }
        
        else if($p == "getLanes")
        {
            $time="";
            if (isset($start)){$time="WHERE `date_created`>='$start' and `date_created`<='$end'";}
            $data=$query->queryTable("
            SELECT id,  name, facility, total_reads, total_samples
            FROM biocore.ngs_lanes $time
            ");
        }
        else if($p == "getSamples")
        {
            $time="";
            if (isset($start)){$time="and `date_created`>='$start' and `date_created`<='$end'";}
            $data=$query->queryTable("
            SELECT id, title, source, organism, molecule
            FROM biocore.ngs_samples $time
            ");
        }
    }
}
else if ($p == "getSelectedSamples")
{
    
    //Prepare selected search query
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
    SELECT id, title, source, organism, molecule
    FROM biocore.ngs_samples
    WHERE $searchQuery $time
    ");
}
else if ($p == "submitPipeline")
{
    $time="";
    if (isset($start)){$time="and `date_created`>='$start' and `date_created`<='$end'";}
    $data=$query->queryTable("
    INSERT INTO ngs_runparams (outdir, run_status, barcode)
    VALUES (\"/this/is/but/a/test\", 0, 0)
    $time
    ");
}

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo $data;
exit;
?>
