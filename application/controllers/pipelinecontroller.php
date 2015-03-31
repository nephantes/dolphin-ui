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
    
    function afterAction() {

    }

}
