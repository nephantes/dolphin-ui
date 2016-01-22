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
					<div class="row margin">
						<div class="col-md-2">
							<div id="downloadOptions" class="btn-group">
								<button id="generated_button" type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-expanded="true">Download Type  <span class="fa fa-caret-down"></span></button>
							</div>
						</div>
						<div class="col-md-10">
							<form class="form-horizontal">
								<div class="form-group">
									<label class='col-sm-3 control-label'>Save Table As:</label>
									<div class="col-sm-9">
										<input type="text" class="form-control" id="input_table_name">
									</div>
								</div>
							</form>
						</div>
					</div>
					<div class="row">
						<div class="col-md-12">
							<div id="generated_table" class="margin col-md-12">
								<?php
									$_SESSION['tablecreatorcheck'] = true;
									echo $html->getRespBoxTableStream("Table Generated", "generated", [], []);
									unset($_SESSION['tablecreatorcheck']);
								?>
							</div>
							<div class="margin col-md-12">
								<button class="btn btn-box-tool btn-primary margin pull-right" onclick="saveTable()">Save Table</button>
								<button class="btn btn-box-tool btn-primary margin pull-right" onclick="backToTableIndex()">Back</button>
							</div>
						</div>
					</div><!-- /.row -->
				</section><!-- /.content -->

