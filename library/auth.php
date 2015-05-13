<?php
if (!isset($_SESSION) || !is_array($_SESSION)) session_start();

if ($_SESSION['user'] == "")
{
  if ($_POST['username']=="" && $_POST['password']=="")
  {
    require_once("../includes/loginform.php");
    exit;
  }
  else
  {
    require_once("../includes/login.php");
  }
}
if (isset($_GET['p']) && $_GET['p'] == "logout" )
{
  session_destroy();
  require_once("../includes/loginform.php");
  exit;
}

