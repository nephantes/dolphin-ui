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
if (isset($_GET['start'])){$start = $_GET['start'];}
if (isset($_GET['end'])){$end = $_GET['end'];}

//browse
if($seg == "browse")
{
    //make the q val proper for queries
    if($q == "Assay"){ $q = "library_type"; }
    else { $q = strtolower($q); }
    
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
        FROM biocore.ngs_protocols $time
        ");
    }
}
else
{

    //details
    
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


header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo $data;
exit;
?>
