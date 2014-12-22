<?php
 
/** Configuration Variables **/
 
define ('DEVELOPMENT_ENVIRONMENT',true);

date_default_timezone_set('America/New_york');

 
define('DB_NAME', 'biocore');
define('DB_USER', 'biocore');
define('DB_PASSWORD', 'biocore2013');
define('DB_HOST', 'galaxy.umassmed.edu');
#define('DB_HOST', 'localhost');
if (isset($_SESSION['$user']))
{
  define('USERNAME', $_SESSION['$user']);
}

define('BASE_PATH','http://biocore.umassmed.edu/dolphin');
#define('BASE_PATH','http://localhost/dolphin');


