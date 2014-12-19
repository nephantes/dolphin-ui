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
Editor::inst( $db, 'ngs_lanes' )
	->fields(
		Field::inst( 'ngs_lanes.name' ),
		Field::inst( 'ngs_lanes.series_id' )
		   ->options('ngs_experiment_series', 'id', 'experiment_name'),
		Field::inst( 'ngs_experiment_series.experiment_name' ),
		Field::inst( 'ngs_lanes.facility' ),
		Field::inst( 'ngs_lanes.cost' ),
		Field::inst( 'ngs_lanes.date_submitted' )
            		->validator( 'Validate::dateFormat', array(
                    		"empty" => false,
                    		"format" => Format::DATE_ISO_8601,
                    		"message" => "Please enter a date in the format yyyy-mm-dd"
            		) )
            		->getFormatter( 'Format::date_sql_to_format', Format::DATE_ISO_8601 )
            		->setFormatter( 'Format::date_format_to_sql', Format::DATE_ISO_8601 ),
		Field::inst( 'ngs_lanes.date_received' )
            		->validator( 'Validate::dateFormat', array(
                    		"empty" => false,
                    		"format" => Format::DATE_ISO_8601,
                    		"message" => "Please enter a date in the format yyyy-mm-dd"
            		) )
            		->getFormatter( 'Format::date_sql_to_format', Format::DATE_ISO_8601 )
            		->setFormatter( 'Format::date_format_to_sql', Format::DATE_ISO_8601 ),

		Field::inst( 'ngs_lanes.total_reads' ),
		Field::inst( 'ngs_lanes.phix_requested' ),
		Field::inst( 'ngs_lanes.phix_in_lane' ),
		Field::inst( 'ngs_lanes.total_samples' ),
		Field::inst( 'ngs_lanes.resequenced' ),
		Field::inst( 'ngs_lanes.notes' )
	)
	->leftJoin( 'ngs_experiment_series', 'ngs_experiment_series.id', '=', 'ngs_lanes.series_id' )
	->process( $_POST )
	->json();
