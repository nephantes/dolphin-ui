<?php
 
class DebrowserController extends VanillaController {

	function beforeAction() {
	
	}
	
	function index($from = 'tablegen') {
		$this->set('title','DEBrowser');
		if(isset($_SESSION['debrowser'])){
			$this->set('jsonobject', '/?jsonobject='.urlencode($_SESSION['debrowser']).'&username='.$_SESSION['user'] );
		}else{
			$this->set('jsonobject','/?jsonobject=yes&username='.$_SESSION['user'] );
		}
	}
	
	function afterAction() {
	
	}

}
