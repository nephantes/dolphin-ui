<!-- Content Header (Page header) -->
                <section class="content-header">
                    <h1>
                        NGS Pipeline 
                        <small>Workflow creation</small>
                    </h1>
                    <ol class="breadcrumb">
                        <li><a href="<?php echo BASE_PATH?>"><i class="fa fa-dashboard"></i> Home</a></li>
			<li><a href="<?php echo BASE_PATH."/search"?>">NGS Pipeline</a></li>
			<li class="active"><?php echo $field?></li
                    </ol>
                </section>
                <!-- Main content -->
                <section class="content">
                    <div class="row">
                        <div class="col-md-12">
                        <?php echo $html->sendJScript('status', "", "", ""); ?>
			<?php echo $html->getRespBoxTable_ng("Current Run Status", "runparams", "<th>ID</th><th>Run Group</th><th>Name</th><th>Sample ID</th><th>Group ID</th><th>Description</th><th>Selected</th>"); ?>
                        </div><!-- /.col (RIGHT) -->
			<div class="col-md-9"></div>
			<div class="col-md-3">
                        <input type="button" id="" class="btn btn-primary" value="Report Details" onClick=""/>
			<input type="button" id="" class="btn btn-primary" value="Re-run Selected" onClick="rerunSelected()"/>
                        </div>
                    </div><!-- /.row -->
                </section><!-- /.content -->
                