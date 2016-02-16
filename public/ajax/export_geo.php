<?php
//error_reporting(E_ERROR);
error_reporting(E_ALL);
ini_set('report_errors','on');

require_once("../../config/config.php");
require_once("../../includes/dbfuncs.php");
require_once("../../includes/excel/Classes/PHPExcel.php");
//header

function num2alpha($n){
		for($r = ""; $n >= 0; $n = intval($n / 26) - 1){
			$r = chr($n%26 + 0x41) . $r;
		}
		return $r;
}

$query = new dbfuncs();

if (isset($_GET['p'])){$p = $_GET['p'];}

if($p == 'exportGeo')
{
    $user = $_SESSION['user'];
	//	Change directory and obtain empty template name
	$inputFileName = "../tmp/files/Blank_Excel_Geo.xls";
	
	//	Load in the empty excel template
	$objPHPExcel = PHPExcel_IOFactory::load($inputFileName);
	$objPHPExcel->setActiveSheetIndex(3);
	
	//	Change values within the Excel file
	if (isset($_GET['samples'])){$samples = $_GET['samples'];}
	
	//	Samples and data gathering
	$sample_data = json_decode($query->queryTable(
		"SELECT ngs_samples.id, ngs_samples.series_id, ngs_samples.protocol_id, ngs_samples.lane_id,
		ngs_samples.name, ngs_samples.samplename, ngs_samples.barcode, ngs_samples.title, ngs_samples.batch_id,
		ngs_samples.description, ngs_samples.avg_insert_size, ngs_samples.read_length, ngs_samples.concentration,
		ngs_samples.time, ngs_samples.biological_replica, ngs_samples.technical_replica, ngs_samples.spike_ins,
		source, source_symbol, organism, genotype, molecule, library_type, donor, biosample_type, instrument_model,
		treatment_manufacturer, ngs_samples.adapter, ngs_samples.notebook_ref, ngs_samples.notes, ngs_lanes.name as l_name,
		ngs_protocols.name as p_name, target
		FROM ngs_samples
		LEFT JOIN ngs_lanes
		ON ngs_samples.lane_id = ngs_lanes.id
		LEFT JOIN ngs_protocols
		ON ngs_samples.protocol_id = ngs_protocols.id
		LEFT JOIN ngs_donor
		ON ngs_samples.donor_id = ngs_donor.id
		LEFT JOIN ngs_source
		ON ngs_samples.source_id = ngs_source.id
		LEFT JOIN ngs_organism
		ON ngs_samples.organism_id = ngs_organism.id
		LEFT JOIN ngs_molecule
		ON ngs_samples.molecule_id = ngs_molecule.id
		LEFT JOIN ngs_genotype
		ON ngs_samples.genotype_id = ngs_genotype.id
		LEFT JOIN ngs_library_type
		ON ngs_samples.library_type_id = ngs_library_type.id
		LEFT JOIN ngs_biosample_type
		on ngs_samples.biosample_type_id = ngs_biosample_type.id
		LEFT JOIN ngs_instrument_model
		ON ngs_samples.instrument_model_id = ngs_instrument_model.id
		LEFT JOIN ngs_treatment_manufacturer
		ON ngs_samples.treatment_manufacturer_id = ngs_treatment_manufacturer.id
		LEFT JOIN ngs_antibody_target
		ON ngs_samples.target_id = ngs_antibody_target.id
		WHERE ngs_samples.id IN (".implode(",", $samples).")
		"));
	
	$experiment_series = $sample_data[0]->series_id;
	$experiment_data = json_decode($query->queryTable(
		"SELECT ngs_experiment_series.experiment_name, ngs_experiment_series.summary,
		ngs_experiment_series.design, ngs_experiment_series.`grant`,
		organization, lab
		FROM ngs_experiment_series
		LEFT JOIN ngs_lab
		ON ngs_experiment_series.lab_id = ngs_lab.id
		LEFT JOIN ngs_organization
		ON ngs_experiment_series.organization_id = ngs_organization.id
		WHERE ngs_experiment_series.id = $experiment_series
		"));
	$contributors = json_decode($query->queryTable("
		SELECT contributor
		FROM ngs_contributors
		WHERE series_id = $experiment_series
		"))
	
	$objPHPExcel->getActiveSheet()->setCellValue('B9', $experiment_data[0]->experiment_name);
	$objPHPExcel->getActiveSheet()->setCellValue('B10', $experiment_data[0]->summary);
	$objPHPExcel->getActiveSheet()->setCellValue('B11', $experiment_data[0]->design);
	$count = 12;
	foreach($contributors as $c){
		if($count < 14){
		    $objPHPExcel->getActiveSheet()->setCellValue('B'.$count, $c);
			$count++;
		}else{
		    $objWorksheet->insertNewRowBefore($count, 1);
			$objPHPExcel->getActiveSheet()->setCellValue('A'.$count, 'contributor');
			$objPHPExcel->getActiveSheet()->setCellValue('B'.$count, $c);
			$count++;
		}
	}
	
	$count = $count+8;
	
	$fastq_files = json_decode($query->queryTable("
		SELECT *
		FROM ngs_fastq_files
		WHERE sample_id in (".implode(",", $samples).")
		");
	
	$sample_bench = $count + 3;
	foreach($sample_data as $sd){
		if($count >= $sample_bench){
			$objWorksheet->insertNewRowBefore($count, 1);	
		}
		$objPHPExcel->getActiveSheet()->setCellValue('A'.$count, $sd->sample_name);
		$objPHPExcel->getActiveSheet()->setCellValue('B'.$count, $sd->title);
		$objPHPExcel->getActiveSheet()->setCellValue('C'.$count, $sd->source);
		$objPHPExcel->getActiveSheet()->setCellValue('D'.$count, $sd->organism);
		if($sd->condition != null){
				$objPHPExcel->getActiveSheet()->setCellValue('E'.$count, $sd->condition);
		}
		if($sd->target != null){
				$objPHPExcel->getActiveSheet()->setCellValue('F'.$count, $sd->target);
		}
		if($sd->molecule != null){
				$objPHPExcel->getActiveSheet()->setCellValue('G'.$count, $sd->molecule);
		}
		
	}
	
	$lane_ids = array();
	$protocol_ids = array();
	$col_number = 4;
	
	
	
}

?>