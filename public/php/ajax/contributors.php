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
Editor::inst( $db, 'ngs_contributors' )
	->fields(
		Field::inst( 'ngs_contributors.contributor' ),
		Field::inst( 'ngs_contributors.series_id' )
		   ->options('ngs_experiment_series', 'id', 'experiment_name'),
		Field::inst( 'ngs_experiment_series.experiment_name' )
	)
	->leftJoin( 'ngs_experiment_series', 'ngs_experiment_series.id', '=', 'ngs_contributors.series_id' )
	->process( $_POST )
	->json();
