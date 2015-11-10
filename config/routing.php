<?php

$routing = array(
        '/admin\/(.*?)\/(.*?)\/(.*)/' => 'admin/\1_\2/\3'
);

$default['controller'] = 'admindashboards';
$default['action'] = 'index';
