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
Editor::inst( $db, 'datafields' )
	->fields(
		Field::inst( 'datafields.datatable_id' )
		   ->options('datatables', 'id', 'mainmysql_table'),
		Field::inst( 'datatables.mainmysql_table' ),
		Field::inst( 'datafields.tablename' ),
		Field::inst( 'datafields.fieldname' ),
		Field::inst( 'datafields.title' ),
		Field::inst( 'datafields.summary' ),
		Field::inst( 'datafields.type' ),
		Field::inst( 'datafields.len' ),
		Field::inst( 'datafields.joinedtablename' ),
		Field::inst( 'datafields.joinedfieldidname' ),
		Field::inst( 'datafields.joinedtargetfield' )
	)
	->leftJoin( 'datatables', 'datatables.id', '=', 'datafields.datatable_id' )
	->process( $_POST )
	->json();
