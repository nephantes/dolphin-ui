<?php
 
class SamplesController extends VanillaController {

    function beforeAction() {

    }
 
    function index() {
        
        $tablename="ngs_samples";
        
        $this->set('table',$this->Sample->getDataTable($tablename));
        $this->set('fields', $this->Sample->getDataFields($tablename));
          
    }
    function afterAction() {

    }

}
