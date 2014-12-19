<?php
 
class ExperimentseriesController extends VanillaController {

    function beforeAction() {

    }
 
    function index() {
        
        $tablename="ngs_experiment_series";
        
        $table = $this->Experimentseries->query("select * from datatables where mainmysql_table='$tablename'");
        $table = json_decode($table, true);
        $this->set('table',$table);
        
        $res = $this->Experimentseries->query("select * from datatables dt, datafields df where dt.mainmysql_table='$tablename' and df.datatable_id=dt.id");
        $res = json_decode($res, true);
        $this->set('fields', $res);
        
        
    }

    function afterAction() {

    }

}
