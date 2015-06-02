<?php
/** Configuration Variables **/
/** If DOLPHIN_PARAMS_SECTION environment variable set into any parameter section in config.ini file 
The configuration parameters will be read from that section**/

$param_section = "Default";

if (!empty(getenv('DOLPHIN_PARAMS_SECTION'))){
   $param_section=getenv('DOLPHIN_PARAMS_SECTION');
}
 
$ini = parse_ini_file("config.ini", true);

$ini_array = $ini[$param_section];

define ('DEVELOPMENT_ENVIRONMENT',true);

date_default_timezone_set($ini_array['TIMEZONE']);

define('DB_NAME', $ini_array['DB_NAME']);
define('DB_USER', $ini_array['DB_USER']);
define('DB_PASSWORD', $ini_array['DB_PASSWORD']);
define('DB_HOST', $ini_array['DB_HOST']);
if (!isset($_SESSION) || !is_array($_SESSION)) session_start();
if (isset($_SESSION['user']))
{
  define('USERNAME', $_SESSION['user']);
  define('UID', $_SESSION['uid']);
}

define('BASE_PATH', $ini_array['BASE_PATH']);
define('API_PATH', $ini_array['API_PATH']);
