<!DOCTYPE html>
<html>
    <head> 
        <meta charset="UTF-8">
        <title>Biocore-Dolphin</title>
        <meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' name='viewport'>
        <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
        <link href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
        <!-- Ionicons -->
        <link href="//code.ionicframework.com/ionicons/1.5.2/css/ionicons.min.css" rel="stylesheet" type="text/css" />
        <!-- Morris chart -->
        <link href="<?php echo BASE_PATH?>/css/morris/morris.css" rel="stylesheet" type="text/css" />
        <!-- jvectormap -->
        <link href="<?php echo BASE_PATH?>/css/jvectormap/jquery-jvectormap-1.2.2.css" rel="stylesheet" type="text/css" />
        <!-- Date Picker -->
        <link href="<?php echo BASE_PATH?>/css/datepicker/datepicker3.css" rel="stylesheet" type="text/css" />
        <!-- Daterange picker -->
        <link href="<?php echo BASE_PATH?>/css/daterangepicker/daterangepicker-bs3.css" rel="stylesheet" type="text/css" />
        <!-- bootstrap wysihtml5 - text editor -->
        <link href="<?php echo BASE_PATH?>/css/bootstrap-wysihtml5/bootstrap3-wysihtml5.min.css" rel="stylesheet" type="text/css" />
        <!-- Theme style -->
        <link href="<?php echo BASE_PATH?>/css/AdminLTE.css" rel="stylesheet" type="text/css" />
        <!-- DATA TABLES -->
        <link href="<?php echo BASE_PATH?>/css/datatables/dataTables.bootstrap.css" rel="stylesheet" type="text/css" />

        <link href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
        <link href="//code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" rel="stylesheet" type="text/css" />
     
        <link href="//cdn.datatables.net/tabletools/2.2.3/css/dataTables.tableTools.css" rel="stylesheet" type="text/css" />
        <link href="//cdn.datatables.net/plug-ins/725b2a2115b/integration/bootstrap/3/dataTables.bootstrap.css" rel="stylesheet" type="text/css" />
        <link href="//editor.datatables.net/examples/resources/bootstrap/editor.bootstrap.css" rel="stylesheet" type="text/css" />

        <link href="<?php echo BASE_PATH?>/css/AdminLTE.css" rel="stylesheet" type="text/css" />

        <link rel="stylesheet" type="text/css" href="//cdn.datatables.net/1.10.4/css/jquery.dataTables.css">
        <link rel="stylesheet" type="text/css" href="<?php echo BASE_PATH?>/css/datatables/dataTables.editor.css">
        <link rel="stylesheet" type="text/css" href="<?php echo BASE_PATH?>/js/dataTables/resources/syntax/shCore.css">
   
        <script src="http://zlab4.umassmed.edu/~zhux3/snowflakes/snowflake.js" charset="utf-8"></script>
		<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
   
        <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
        <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
        <!--[if lt IE 9]>
          <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
          <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
        <![endif]-->
    </head>
    <body class="skin-blue">
        <!-- header logo: style can be found in header.less -->
        <div class="header">
            <a href="<?php echo BASE_PATH;?>" class="logo">
                <!-- Add the class icon to your logo image or logo icon to add the margining -->
                Biocore - Dolphin
            </a>
            <!-- Header Navbar: style can be found in header.less -->
            <nav class="navbar navbar-static-top" role="navigation">
                <!-- Sidebar toggle button-->
                <a href="#" class="navbar-btn sidebar-toggle" data-toggle="offcanvas" role="button">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </a>
                <div class="navbar-right">
                    <ul class="nav navbar-nav">
                        <?php require_once("../includes/messages.php");?>
                        <?php require_once("../includes/notifications.php");?>
                        <?php require_once("../includes/tasks.php");?>
                        <?php require_once("../includes/useraccount.php"); ?>
                    </ul>
                </div>
            </nav>
        </div>
        <div class="wrapper row-offcanvas row-offcanvas-left">
            <!-- Left side column. contains the logo and sidebar -->
            <aside class="left-side sidebar-offcanvas">
                <!-- sidebar: style can be found in sidebar.less -->
                <section class="sidebar">
                    <?php require_once("../includes/sidebaruserpanel.php");?>
                    <?php require_once("../includes/search.php");?>
                    <?php require_once("../includes/sidebarmenu.php");?>
            </aside>

            <!-- Right side column. Contains the navbar and content of the page -->
            <aside class="right-side">
