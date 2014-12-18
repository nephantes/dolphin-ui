<?php
 
class DashboardsController extends VanillaController {

    function beforeAction() {

    }
 
    function index() {
     
        $this->set('title','Main Dashboard');
    }

    function afterAction() {

    }

}
