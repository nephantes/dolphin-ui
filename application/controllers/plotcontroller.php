<?php

class PlotController extends VanillaController {

	function beforeAction() {

	}
	
	function index(){
		$this->set('field', "Plots");
	}
	function cluster(){
		$this->set('field', "Cluster");
	}
	
	
	function double(){
		$this->set('field', "Plots");
	}
	
	function afterAction(){
		
	}
}
