<?php
 
class ContributorsController extends VanillaController {

    function beforeAction() {

    }
 
    function index() {

        $tablename="ngs_contributors";
        
        $this->set('table',$this->Contributor->getDataTable($tablename));
        $this->set('fields', $this->Contributor->getDataFields($tablename));
        
    }

    function afterAction() {

    }

}
