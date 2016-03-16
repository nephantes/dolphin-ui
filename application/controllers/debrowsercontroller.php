<?php
 
class DebrowserController extends VanillaController {

	function beforeAction() {
	
	}
	
	function index() {
		$this->set('title','DEBrowser');
		if(isset($_SESSION['debrowser'])){
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
