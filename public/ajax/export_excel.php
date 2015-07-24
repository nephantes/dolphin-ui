<?php
//error_reporting(E_ERROR);
error_reporting(E_ALL);
ini_set('report_errors','on');

require_once("../../config/config.php");
require_once("../../includes/dbfuncs.php");
require_once("../../includes/excel/Classes/PHPExcel.php");
//header

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