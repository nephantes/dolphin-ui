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
Editor::inst( $db, 'datatables' )
	->fields(
		Field::inst( 'name' ),
		Field::inst( 'parent_name' ),
		Field::inst( 'parent_link' ),
		Field::inst( 'ajax' ),
		Field::inst( 'tablename' ),
		Field::inst( 'joined' )
	)
	->process( $_POST )
	->json();
