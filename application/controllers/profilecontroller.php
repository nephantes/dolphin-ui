<?php

class ProfileController extends VanillaController {

	function beforeAction() {
        
	}
	
	function index(){
		$this->username=$_SESSION['user'];
		$this->set('title','Profile');
	}
	
	function afterAction(){
		
	}
}