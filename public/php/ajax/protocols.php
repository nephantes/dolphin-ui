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
Editor::inst( $db, 'ngs_protocols' )
	->fields(
		Field::inst( 'name' ),
		Field::inst( 'growth' ),
		Field::inst( 'treatment' ),
		Field::inst( 'extraction' ),
		Field::inst( 'library_construction' ),
		Field::inst( 'library_strategy' )
	)
	->process( $_POST )
	->json();
