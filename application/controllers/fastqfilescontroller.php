<?php
 
class FastqfilesController extends VanillaController {

    function beforeAction() {

    }
    
    function index() {
        
        $tablename="ngs_fastq_files";
        
        $this->set('table',$this->Fastqfile->getDataTable($tablename));
        $this->set('fields', $this->Fastqfile->getDataFields($tablename));
          
    }

    function afterAction() {

    }

}
