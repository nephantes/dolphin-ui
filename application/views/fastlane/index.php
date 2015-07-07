<!-- Content Header (Page header) -->
				<section class="content-header">
					<h1>
						NGS Fastlane
						<small>Fast database entry</small>
					</h1>
					<ol class="breadcrumb">
						<li><a href="<?php echo BASE_PATH?>"><i class="fa fa-dashboard"></i> Home</a></li>
			<li><a href="<?php echo BASE_PATH."/search"?>">NGS Pipeline</a></li>
			<li class="active"><?php echo $field?></li
					</ol>
				</section>
			<?php echo $html->sendJScript("fastlane", "", "", "", $uid, $gids); ?>
			<form role="form" enctype="multipart/form-data" action="fastlane/process" method="post">
				<section class="content">
					<div class="row">
						<div id="static_info_selection" class="col-md-12">
							<?php echo $html->getStaticSelectionBox("Genome Build", "genomebuild", "<option>human,hg19</option>
																				<option>hamster,cho-k1</option>
																				<option>rat,rn5</option>
																				<option>zebrafish,danRer7</option>
																				<option>mouse,mm10</option>
																				<option>mousetest,mm10</option>
																				<option>s_cerevisiae,sacCer3</option>
																				<option>c_elegans,ce10</option>
																				<option>cow,bosTau7</option>
																				<option>d_melanogaster,dm3</option>", 4)?>
							<?php echo $html->getStaticSelectionBox("Barcode Seperation", "barcode_sep", "<option>no</option>
																				<option>yes</option>", 4)?>
							<script>
								document.getElementById('barcode_sep').setAttribute('onchange', 'expandBarcodeSep()');
							</script>
							<?php echo $html->getStaticSelectionBox("Mate-paired", "spaired", "<option>yes</option>
																				<option>no</option>", 4)?>
						</div>
						<div id="barcode_div" class="col-md-12" style="display: none">
							<?php echo $html->getStaticSelectionBox("Barcode Definitions", "Barcode Definitions", "TEXTBOX", 12)?>
						</div>
						<div id="barcode_opt_div" class="col-md-12" style="display: none">
							<?php echo $html->getStaticSelectionBox("Barcode Distance Options", "bar_distance", "<option>1</option>
																				<option>2</option>
																				<option>3</option>
																				<option>4</option>
																				<option>5</option>", 6)?>
							<?php echo $html->getStaticSelectionBox("Barcode Format Options", "bar_format", "<option>5 end read 1</option>
																	<option>3 end read 2 (or 3 end on single end)</option>
																	<option>barcode is in header (illumina casava)</option>
																	<option>no barcode on read 1 of a pair (read 2 must have on 5 end)</option>
																	<option>paired end both reads 5 end</option>", 6)?>
						</div>
						<div id="name_div" class="col-md-12">
							<?php echo $html->getStaticSelectionBox("Experiment Series Name", "series_name", "TEXT", 6)?>
							<?php echo $html->getStaticSelectionBox("Import Name", "lane_name", "TEXT", 6)?>
						</div>
						<div id="input_files_div" class="col-md-12">
							<?php echo $html->getStaticSelectionBox("Input Directory (Full path)", "input_dir", "TEXT", 12)?>
							<?php echo $html->getStaticSelectionBox("Input Files", "input_files", "TEXTBOX", 12)?>
						</div>
						<div id="output_files" class="col-md-12">
							<?php echo $html->getStaticSelectionBox("Backup Directory (Full path)", "backup_dir", "TEXT", 12)?>
							<?php echo $html->getStaticSelectionBox("Amazon Bucket", "amazon_bucket", "TEXT", 12)?>
						</div>
					</div><!-- /.row -->
					<div class="row">
						<div class="col-md-12">
							<input type="submit" name="submitted_fastlane" id="submit_fastlane" class="btn btn-primary" onclick="submitFastlaneButton()" innerHTML="Submit Fastlane"/>
						</div>
					</div><!-- /.row -->
				</section><!-- /.content -->
			</form>
