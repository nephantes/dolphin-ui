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
							<div id="generated_table" class="margin col-md-9">
								<?php echo $html->getRespBoxTableStream("Table Generated", "generated", [], []); ?>
							</div>
						</div>
						<div class="col-md-12">
							<div id="text_table" class="margin col-md-9">
								<?php echo $html->getExpandingAnalysisBox('Export Table', "table_export", true); ?>
							</div>
							<div class="margin col-md-9">
								<button class="btn btn-box-tool btn-primary margin pull-right" onclick="backToTableIndex()">Back</button>
							</div>
						</div><!-- /.col (LEFT) -->
					</div><!-- /.row -->
				</section><!-- /.content -->

