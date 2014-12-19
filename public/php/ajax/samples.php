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
Editor::inst( $db, 'ngs_samples' )
	->fields(
		Field::inst( 'ngs_samples.name' ),
                Field::inst( 'ngs_samples.series_id' )
                   ->options('ngs_experiment_series', 'id', 'experiment_name'),
                Field::inst( 'ngs_experiment_series.experiment_name' ),

		Field::inst( 'ngs_samples.protocol_id' )
		   ->options('ngs_protocols', 'id', 'name'),
 		Field::inst( 'ngs_protocols.name' ),
		Field::inst( 'ngs_samples.lane_id' )
		   ->options('ngs_lanes', 'id', 'name'),
 		Field::inst( 'ngs_lanes.name' ),
		Field::inst( 'ngs_samples.barcode' ),
		Field::inst( 'ngs_samples.title' ),
		Field::inst( 'ngs_samples.source' ),
		Field::inst( 'ngs_samples.organism' ),
		Field::inst( 'ngs_samples.molecule' ),
		Field::inst( 'ngs_samples.description' ),
		Field::inst( 'ngs_samples.instrument_model' ),
		Field::inst( 'ngs_samples.avg_insert_size' ),
		Field::inst( 'ngs_samples.read_length' ),
		Field::inst( 'ngs_samples.genotype' ),
		Field::inst( 'ngs_samples.condition' ),
		Field::inst( 'ngs_samples.library_type' ),
		Field::inst( 'ngs_samples.adapter' ),
		Field::inst( 'ngs_samples.notebook_ref' ),
		Field::inst( 'ngs_samples.notes' )
	)
	->leftJoin( 'ngs_experiment_series', 'ngs_experiment_series.id', '=', 'ngs_samples.series_id' )
	->leftJoin( 'ngs_protocols', 'ngs_protocols.id', '=', 'ngs_samples.protocol_id' )
	->leftJoin( 'ngs_lanes', 'ngs_lanes.id', '=', 'ngs_samples.lane_id' )
	->process( $_POST )
	->json();
