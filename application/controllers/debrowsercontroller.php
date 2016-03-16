<?php
 
class DebrowserController extends VanillaController {

	function beforeAction() {
	
	}
	
	function index() {
		$this->set('title','DEBrowser');
		if(isset($_SESSION['debrowser'])){
			#$decoded = json_decode($_SESSION['debrowser']);
			$this->set('jsonobject', '/?jsonobject='.$_SESSION['debrowser']);
		}else{
			$this->set('jsonobject','');
			$encoded = urlencode('http://dolphin.umassmed.edu/public/api/?source=http://dolphin.umassmed.edu/public/pub/vw1hmHIju8duT6AnpYBZBT5SAG5dLZ/rsem/genes_expression_expected_count.tsv&format=JSON');
			$this->set('jsonobject', '/?jsonobject='.$encoded.'&title=no');
		}
	}
	
	function afterAction() {
	
	}

}
