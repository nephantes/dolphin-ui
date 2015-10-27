<!-- Content Header (Page header) -->
				<section class="content-header">
					<h1>
						NGS Table Viewer
						<small>Custom table viewer</small>
					</h1>
					<ol class="breadcrumb">
						<li><a href="<?php echo BASE_PATH?>"><i class="fa fa-dashboard"></i> Home</a></li>
						<li><a href="<?php echo BASE_PATH."/search"?>">NGS Table Creator</a></li>
						<li class="active"><?php echo $field?></li
					</ol>
				</section>
				<!-- Main content -->
				<?php echo $html->sendJScript("generated", "", "", "", $uid, $gids); ?>
				<section class="content">
					<div class="row">
						<div class="col-md-12">
							<div id="generated_table" class="margin col-md-12">
								<?php
									$_SESSION['tablecreatorcheck'] = true;
									echo $html->getRespBoxTableStream("Table Generated", "generated", [], []);
									unset($_SESSION['tablecreatorcheck']);
								?>
							</div>
						</div>
						<div class="col-md-12">
							<div id="text_table" class="margin col-md-12">
								<?php echo $html->getExpandingAnalysisBox('Export Table', "table_export", false); ?>
							</div>
							<div id="name_run_box" class="margin col-md-12">
								<?php echo $html->getStaticSelectionBox("Save Table As:", "input_table_name", "TEXT", 12)?>
							</div>
							<div class="margin col-md-12">
								<button class="btn btn-box-tool btn-primary margin pull-right" onclick="saveTable()">Save Table</button>
								<button class="btn btn-box-tool btn-primary margin pull-right" onclick="backToTableIndex()">Back</button>
							</div>
						</div><!-- /.col (LEFT) -->
					</div><!-- /.row -->
				</section><!-- /.content -->

