<!-- Content Header (Page header) -->
				<section class="content-header">
					<h1>
						NGS Table Creator
						<small>Custom table creation</small>
					</h1>
					<ol class="breadcrumb">
						<li><a href="<?php echo BASE_PATH?>"><i class="fa fa-dashboard"></i> Home</a></li>
						<li><a href="<?php echo BASE_PATH."/search"?>">NGS Table Creator</a></li>
						<li class="active"><?php echo $field?></li
					</ol>
				</section>
				<!-- Main content -->
				<?php echo $html->sendJScript("table_create", "", "", "", $uid, $gids); ?>
				<section class="content">
					<div class="row">
						<div class="col-md-12">
							<div class="margin col-md-6">
								<?php 
									echo $html->getRespBoxTable_ng("Samples Selected", "selected_samples", "<th>id</th><th>Sample Name</th><th>Run ID</th><th>Delete</th>");
								?>
							</div>
							<div class="margin col-md-3">
								<div class="col-md-12">
									<div class="box">
										<div class="box-header">
											<h3 class="box-title">Report Selection
											</h3>
										</div>
										<div class= "box-body">
											<select id="report_multi_box" class="form-control" size="20" multiple>
											</select>
										</div>
										<div class="box-footer">
											<div>
												<h4>Table saved as:
												</h4>
												<input type="text" id="input_table_name" class="form-control">
											</div>
											<div>
												<button class="btn btn-primary margin" onclick="saveTable()">Save Table</button>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="margin col-md-9">
								<?php echo $html->getExpandingAnalysisBox('Additional Sample Selection', "table_create", false); ?>
							</div>
							<div class="margin col-md-9">
								<button class="btn btn-box-tool btn-primary margin pull-right" onclick="tableCreatorPage()">Generate Table</button>
								<button class="btn btn-box-tool btn-primary margin pull-right" onclick="toTableListing()">To Created Tables</button>
							</div>
						</div><!-- /.col (LEFT) -->
					</div><!-- /.row -->
				</section><!-- /.content -->

