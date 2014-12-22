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

$tablename=$_GET['t'];


        $tables= $db->query( 'select', 'datatables' )
                ->distinct('true')
                ->get( 'id' )
                ->get( 'joined' )
                ->where( 'datatables.tablename',$tablename,'=' )
                ->exec()
                ->fetch();
        $id=$tables{'id'};
        $joined=$tables{'joined'};
        
        $fields= $db->query( 'select', 'datafields' )
                ->distinct('true')
                ->get( '*' )
                ->where( 'datafields.table_id',$id,'=' )
                ->exec()
                ->fetchAll();
        
        $field_arr = array();


        foreach ($fields as $field):
            if ($field{'joinedtablename'}=="")
            {
               $tablestr=($joined=="1") ?  $tablestr=$tablename.".": "";
                
                
               if ($field{'type'}=='date')
               {
                 array_push($field_arr, Field::inst($tablestr.$field{'fieldname'})->validator( 'Validate::dateFormat', array(
                    		"empty" => false,
                    		"format" => Format::DATE_ISO_8601,
                    		"message" => "Please enter a date in the format yyyy-mm-dd"
            		) )
            		->getFormatter( 'Format::date_sql_to_format', Format::DATE_ISO_8601 )
            		->setFormatter( 'Format::date_format_to_sql', Format::DATE_ISO_8601 ));
               }
               else
               {
                  array_push($field_arr, Field::inst($tablestr.$field{'fieldname'}));
               }
            }
            else
            {
                array_push($field_arr, Field::inst($tablename.".".$field{'fieldname'})->options($field{'joinedtablename'}, $field{'joinedfieldidname'} ,$field{'joinedtargetfield'}));
                array_push($field_arr, Field::inst($field{'joinedtablename'}.".".$field{'joinedtargetfield'}));
            }

        endforeach;
        
        //print_r($field_arr);
        
        if ($joined!="1")
        {
        Editor::inst( $db, $tablename )
            ->fields(
		$field_arr
	)
	->process( $_POST )
	->json();
        }
        else
        {
        $out = Editor::inst( $db, $tablename );
        $out=$out->fields($field_arr);
        foreach ($fields as $field):
           if ($field{'joinedtablename'}!="")
           {
              $out=$out->leftJoin( $field{'joinedtablename'}, $field{'joinedtablename'}.".".$field{'joinedfieldidname'}, '=', $tablename.".".$field{'fieldname'} );
           }
        endforeach;
        $out=$out->process( $_POST )
        ->data();
        
        foreach ($fields as $field):
           if ($field{'joinedtablename'}!="")
           {
            // Get a list of sites for the `select` list
            $out[$field{'joinedtablename'}] = $db
              ->selectDistinct( $field{'joinedtablename'}, $field{'joinedfieldidname'}.' as value, '.$field{'joinedtargetfield'}.' as label' )
              ->fetchAll();
            }
        endforeach;

        
        
        echo json_encode( $out );
        }
    
        
        
