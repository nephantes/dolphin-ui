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


if($p == 'exportExcel')
{
	$user = $_SESSION['user'];
	
	//	Change directory and obtain empty template name
	pclose(popen( "cd /Library/WebServer/Documents/dolphin/tmp/files/", "r" ) );
	$inputFileName = '/Library/WebServer/Documents/dolphin/public/tmp/files/Blank_Excel_Export.xls';
	
	//	Load in the empty excel template
	$objPHPExcel = PHPExcel_IOFactory::load($inputFileName);
	$objPHPExcel->setActiveSheetIndex(3);
	
	//	Change values within the Excel file
	if (isset($_GET['samples'])){$samples = $_GET['samples'];}
	
	/*
		Insert Example:
		$objPHPExcel->getActiveSheet()->setCellValue('B3', $_SESSION['user']);
	*/
	
	$sample_data = json_decode($query->queryTable(
		"SELECT ngs_samples.id, ngs_samples.series_id, ngs_samples.protocol_id, ngs_samples.lane_id,
		ngs_samples.name, ngs_samples.samplename, ngs_samples.barcode, ngs_samples.title, ngs_samples.batch_id,
		ngs_samples.description, ngs_samples.avg_insert_size, ngs_samples.read_length, ngs_samples.concentration,
		ngs_samples.time, ngs_samples.biological_replica, ngs_samples.technical_replica, ngs_samples.spike_ins,
		source, source_symbol, organism, genotype, molecule, library_type, donor, biosample_type, instrument_model,
		treatment_manufacturer, ngs_samples.adapter, ngs_samples.notebook_ref, notes
		FROM ngs_samples
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
		WHERE ngs_samples.id IN (".implode(",", $samples).")"));
	
	$experiment_series = $sample_data[0]->series_id;
	$lane_ids = array();
	$protocol_ids = array();
	$col_number = 4;
	
	foreach($sample_data as $sd){
		$objPHPExcel->getActiveSheet()->setCellValue('A'.$col_number, $sd->name);
		//$objPHPExcel->getActiveSheet()->setCellValue('B'.$col_number, $sd->);		//	Lane name
		//$objPHPExcel->getActiveSheet()->setCellValue('C'.$col_number, $sd->);		//	Protocol name
		$objPHPExcel->getActiveSheet()->setCellValue('D'.$col_number, $sd->barcode);
		$objPHPExcel->getActiveSheet()->setCellValue('E'.$col_number, $sd->title);
		$objPHPExcel->getActiveSheet()->setCellValue('F'.$col_number, $sd->batch_id);
		$objPHPExcel->getActiveSheet()->setCellValue('G'.$col_number, $sd->source_symbol);
		$objPHPExcel->getActiveSheet()->setCellValue('H'.$col_number, $sd->source);
		$objPHPExcel->getActiveSheet()->setCellValue('I'.$col_number, $sd->organism);
		$objPHPExcel->getActiveSheet()->setCellValue('J'.$col_number, $sd->biosample_type);
		$objPHPExcel->getActiveSheet()->setCellValue('K'.$col_number, $sd->molecule);
		$objPHPExcel->getActiveSheet()->setCellValue('L'.$col_number, $sd->description);
		$objPHPExcel->getActiveSheet()->setCellValue('M'.$col_number, $sd->instrument_model);
		$objPHPExcel->getActiveSheet()->setCellValue('N'.$col_number, $sd->avg_insert_size);
		$objPHPExcel->getActiveSheet()->setCellValue('O'.$col_number, $sd->read_length);
		$objPHPExcel->getActiveSheet()->setCellValue('P'.$col_number, $sd->genotype);
		//$objPHPExcel->getActiveSheet()->setCellValue('Q'.$col_number, $sd->);		//	condition symbols
		//$objPHPExcel->getActiveSheet()->setCellValue('R'.$col_number, $sd->);		//	conditions
		$objPHPExcel->getActiveSheet()->setCellValue('S'.$col_number, $sd->concentration);
		$objPHPExcel->getActiveSheet()->setCellValue('T'.$col_number, $sd->treatment_manufacturer);
		$objPHPExcel->getActiveSheet()->setCellValue('U'.$col_number, $sd->donor);
		$objPHPExcel->getActiveSheet()->setCellValue('V'.$col_number, $sd->time);
		$objPHPExcel->getActiveSheet()->setCellValue('W'.$col_number, $sd->biological_replica);
		$objPHPExcel->getActiveSheet()->setCellValue('X'.$col_number, $sd->technical_replica);
		$objPHPExcel->getActiveSheet()->setCellValue('Y'.$col_number, $sd->spike_ins);
		$objPHPExcel->getActiveSheet()->setCellValue('Z'.$col_number, $sd->adapter);
		$objPHPExcel->getActiveSheet()->setCellValue('AA'.$col_number, $sd->notebook_ref);
		$objPHPExcel->getActiveSheet()->setCellValue('AB'.$col_number, $sd->notes);
		
		//	Push lane_ids and protocol_ids
		if(!in_array($sd->lane_id, $lane_ids)){
			array_push($lane_ids, $sd->lane_id);
		}
		if(!in_array($sd->protocol_id, $protocol_ids)){
			array_push($protocol_ids, $sd->protocol_id);
		}
		
		$col_number++;
	}
	
	//	Save the file to be downloaded
	$objWriter = new PHPExcel_Writer_Excel2007($objPHPExcel);
	$objWriter->save("/Library/WebServer/Documents/dolphin/tmp/files/test_demo.xlsx");
}

//footer
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo $data;
exit;
?>