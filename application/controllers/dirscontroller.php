<?php
 
class DirsController extends VanillaController {

    function beforeAction() {

    }
 
    function index() {
        
        $tablename="ngs_dirs";
        
        $this->set('table',$this->Dir->getDataTable($tablename));
        $this->set('fields', $this->Dir->getDataFields($tablename));
          
    }

    function afterAction() {

    }

}
