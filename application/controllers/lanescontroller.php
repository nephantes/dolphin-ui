<?php
 
class LanesController extends VanillaController {

    function beforeAction() {

    }
 
    function index() {
        
        $tablename="ngs_lanes";
        
        $this->set('table',$this->Lane->getDataTable($tablename));
        $this->set('fields', $this->Lane->getDataFields($tablename));
          
    }

    function afterAction() {

    }

}
