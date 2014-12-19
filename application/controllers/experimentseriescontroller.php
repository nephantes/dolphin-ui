<?php
 
class ExperimentseriesController extends VanillaController {

    function beforeAction() {

    }
 
    function index() {
        
        $this->title="Experiment Series";
        $this->parenttitle="NGSTrack";
        $this->parentlink="ngstrack";
       
        $this->set('title',$this->title);
        $this->set('parenttitle',$this->parenttitle);
        $this->set('parentlink',$this->parentlink);
    }

    function afterAction() {

    }

}
