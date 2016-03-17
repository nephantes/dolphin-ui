<?php
 
class DebrowserController extends VanillaController {

	function beforeAction() {
	
	}
	
	function index($from = 'tablegen') {
		$this->set('title','DEBrowser');
		if($from == 'index'){
			$this->set('jsonobject','/?title=no');
		}else if(isset($_SESSION['debrowser'])){
			$this->set('jsonobject', '/?jsonobject='.urlencode($_SESSION['debrowser']).'&title=no');
		}else if ($_SESSION['debrowser'] == ''){
			$this->set('jsonobject','/?title=no');
		}else{
			$this->set('jsonobject','/?title=no');
		}
	}
	
	function afterAction() {
	
	}

}
