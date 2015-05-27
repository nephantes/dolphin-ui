<?php

class ProfileController extends VanillaController {

	function beforeAction() {
        
	}
	
	function index(){
		$this->username=$_SESSION['user'];
		$this->set('title','Profile');
		
		require_once '../includes/dbfuncs.php';
		$query=new dbfuncs();
		$avatar=BASE_PATH.$query->getPhotoLoc($_SESSION['user']);
		$this->set('avatar', $avatar);
	}
	
	function afterAction(){
		
	}
}