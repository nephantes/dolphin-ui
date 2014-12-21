<?php
 
class ExperimentseriesController extends VanillaController {

    function beforeAction() {

    }
 
    function index() {
        
        $tablename="ngs_experiment_series";
        
        $this->set('table',$this->Experimentseries->getDataTable($tablename));
        $this->set('fields', $this->Experimentseries->getDataFields($tablename));
          
    }

    function afterAction() {

    }

}
