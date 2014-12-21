<?php
 
class ProtocolsController extends VanillaController {

    function beforeAction() {

    }
 
    function index() {
        
        $tablename="ngs_protocols";
        
        $this->set('table',$this->Protocol->getDataTable($tablename));
        $this->set('fields', $this->Protocol->getDataFields($tablename));
          
    }

    function afterAction() {

    }

}
