<?php
 
class TablesController extends VanillaController {

    private $tablename;
    function beforeAction() {

    }

    function index($tablename) {
        $this->tablename=$tablename;
        if($this->Table->checkPerms(UID, $this->tablename)){
            $this->set('table',$this->Table->getDataTable($this->tablename));
            $this->set('fields', $this->Table->getDataFields($this->tablename));
        }
          
    }
    function afterAction() {

    }

}
