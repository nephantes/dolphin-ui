<?php
 
class DatatablesController extends VanillaController {

    function beforeAction() {

    }
 
    function index() {
        
        $tablename="datatables";
        
        $this->set('table',$this->Datatable->getDataTable($tablename));
        $this->set('fields', $this->Datatable->getDataFields($tablename));
          
    }
    function afterAction() {

    }

}
