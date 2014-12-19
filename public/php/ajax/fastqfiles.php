<?php

/*
 * Example PHP implementation used for the index.html example
 */

// DataTables PHP library
include(  dirname(__FILE__)."/../DataTables.php" );

// Alias Editor classes so they are easy to use
use
	DataTables\Editor,
	DataTables\Editor\Field,
	DataTables\Editor\Format,
	DataTables\Editor\Join,
	DataTables\Editor\Validate;

// Build our Editor instance and process the data coming from _POST
Editor::inst( $db, 'ngs_fastq_files' )
	->fields(
		Field::inst( 'ngs_fastq_files.file_name' ),
		Field::inst( 'ngs_fastq_files.sample_id' )
		   ->options('ngs_samples', 'id', 'name'),
		Field::inst( 'ngs_samples.name' ),
		Field::inst( 'ngs_fastq_files.dir_id' )
		   ->options('ngs_dirs', 'id', 'fastq_dir'),
		Field::inst( 'ngs_dirs.fastq_dir' ),
		Field::inst( 'ngs_fastq_files.lane_id' )
		   ->options('ngs_lanes', 'id', 'name' ),
		Field::inst( 'ngs_lanes.name' ),
		Field::inst( 'ngs_fastq_files.checksum' )
	)
	->leftJoin( 'ngs_samples', 'ngs_samples.id', '=', 'ngs_fastq_files.sample_id' )
	->leftJoin( 'ngs_dirs', 'ngs_dirs.id', '=', 'ngs_fastq_files.dir_id' )
	->leftJoin( 'ngs_lanes', 'ngs_lanes.id', '=', 'ngs_fastq_files.lane_id' )
	->process( $_POST )
	->json();
