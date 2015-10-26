<!-- Content Header (Page header) -->
		<style>
			div.dropdown-menu .li{
				margin-left: auto;
				margin-right: auto;
				table-layout: fixed;
				border-collapse: collapse;
				z-index: 999; position:relative
			}
		</style>
				<section class="content-header">
					<h1>
						NGS Table List
						<small>Custom table list</small>
					</h1>
					<ol class="breadcrumb">
						<li><a href="<?php echo BASE_PATH?>"><i class="fa fa-dashboard"></i> Home</a></li>
						<li><a href="<?php echo BASE_PATH."/search"?>">NGS Table List</a></li>
						<li class="active"><?php echo $field?></li
					</ol>
				</section>
				<!-- Main content -->
				<?php echo $html->sendJScript("table_viewer", "", "", "", $uid, $gids); ?>
				<section class="content">
					<div class="row">
						<div class="col-md-12">
							<div id="generated_table" class="margin col-md-12">
								<?php echo $html->getRespBoxTable_ng("Tables Created", "table_viewer", "<th>ID</th><th>Name</th><th>Samples/Runs</th><th>Files</th><th>Options</th>"); ?>
							</div>
						</div>
						<div class="col-md-12">
							<div id="generated_table" class="margin col-md-12">
								<button class="btn btn-box-tool btn-primary margin pull-right" onclick="backToTableIndex()">Back to Creation</button>
								<button class="btn btn-box-tool btn-primary margin pull-right" onclick="toBrowserPage()">Back to Browser</button>
							</div>
						</div>
					</div><!-- /.row -->
				</section><!-- /.content -->

