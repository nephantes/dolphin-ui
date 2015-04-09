<?php
 
class PipelineController extends VanillaController {

    function beforeAction() {

    }
 
    function index() {
        $this->set('field', "Pipeline");
    }

    function fastlane() {
        $this->set('field', "Fastlane");
    }
    
    function selected() {
        $this->set('field', "Selected");
    }
    
    function selectedv2($selection) {
        $this->set('field', "Selected");
        $this->set('selection', $selection);
    }
    
    function status(){
        $this->set('field', 'Status');
    }
    
    function rerun($run_group, $selection){
        $this->set('selection', $selection);
        $this->set('run_group', $run_group);
        $this->set('field', 'Status');
    }
    
    function report($selection){
        $this->set('selection', $selection);
        $this->set('field', 'Status');
    }
    
    function afterAction() {

    }

}
