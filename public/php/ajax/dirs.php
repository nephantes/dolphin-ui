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
Editor::inst( $db, 'ngs_dirs' )
	->fields(
		Field::inst( 'fastq_dir' ),
		Field::inst( 'backup_dir' ),
		Field::inst( 'amazon_bucket' )
	)
	->process( $_POST )
	->json();
