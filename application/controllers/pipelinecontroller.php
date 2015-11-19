<?php

class PipelineController extends VanillaController {
	private $username;
	
	function beforeAction() {

	}

	function index() {
		$this->set('field', "Pipeline");
	}

	function selected($selection) {
        $this->set('uid', $_SESSION['uid']);
        $gids = $this->Pipeline->getGroup($_SESSION['user']);
        $this->set('gids', $gids);
		$this->set('groups', $this->Pipeline->getGroups($_SESSION['user']));
        
		$this->set('field', "Selected");
		$this->set('selection', $selection);
	}

	function status(){
		$this->set('uid', $_SESSION['uid']);
        $gids = $this->Pipeline->getGroup($_SESSION['user']);
        $this->set('gids', $gids);
        
        $this->set('field', 'Status');
	}

    function advstatus($run_id){
        $this->set('uid', $_SESSION['uid']);
        $gids = $this->Pipeline->getGroup($_SESSION['user']);
        $this->set('gids', $gids);
        
        $this->set('run_id', $run_id);
        $this->set('field', 'Status');
    }
    
	function rerun($run_id, $selection){
		$this->set('uid', $_SESSION['uid']);
        $gids = $this->Pipeline->getGroup($_SESSION['user']);
        $this->set('gids', $gids);
        $this->set('groups', $this->Pipeline->getGroups($_SESSION['user']));
		
        $this->set('selection', $selection);
		$this->set('run_id', $run_id);
		$this->set('field', 'Status');
	}

	function report($run_id, $selection){
		$this->set('uid', $_SESSION['uid']);
        $gids = $this->Pipeline->getGroup($_SESSION['user']);
		$this->set('gids', $gids);
        
        $this->set('run_id', $run_id);
		$this->set('selection', $selection);
		$this->set('field', 'Status');
	}

	function plots($selection){
        $this->set('uid', $_SESSION['uid']);
        $gids = $this->Pipeline->getGroup($_SESSION['user']);
        $this->set('gids', $gids);
        
		$this->set('field', 'Plots');
		$this->set('selection', $selection);
	}

	function afterAction() {

	}

}
