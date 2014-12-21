<?php
 
class DatafieldsController extends VanillaController {

    function beforeAction() {

    }
 
    function index() {

        $tablename="datafields";
        
        $table = $this->Datafield->query("select * from datatables where tablename='$tablename'");
        $table = json_decode($table, true);
        $this->set('table',$table);
        
        $res = $this->Datafield->query("select * from datatables dt, datafields df where dt.tablename='$tablename' and df.table_id=dt.id");
        $res = json_decode($res, true);
        $this->set('fields', $res);
    }

    function afterAction() {

    }

}
