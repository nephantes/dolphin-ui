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

if (!isset($_SESSION) || !is_array($_SESSION)) session_start();
 
$uid=$_SESSION['uid'];

Editor::inst( $db, 'users' )
	->fields(
		Field::inst( 'users.username' ),
		Field::inst( 'users.owner_id' ),
		Field::inst( 'users.group_id' ),
		Field::inst( 'users.perms')
	)
        ->where(function ($q) use( $uid ) {
                   
	            $q->or_where( 'users.group_id', '1' );
	            $q->or_where( 'users.owner_id', $uid);
                    $q->or_where( 'users.perms', '32', '>' );
        })

	->process( $_POST )
	->json();
