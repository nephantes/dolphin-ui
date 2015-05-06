				<section class="content">
					<div class="row">
						<!-- left column -->
						<div class="col-md-6">
							<!-- general form elements -->
							<div class="box box-primary">
								<div class="box-header">
									<h3 class="box-title">Excel Import</h3>
								</div><!-- /.box-header -->
								<div class="box-body">
									<div>				
				<!-- form start -->
								<form role="form" enctype="multipart/form-data" action="ngsimport/process" method="post">
									<div class="box-body">
										<div class="form-group">
											<label for="excelInputFile">Excel file input</label>
											<input type="file" name="excelFile" id="excelFile">
											<p class="help-block">Please choose excel file from your device.</p>
											<a href="<?php echo BASE_PATH?>/downloads/example_ngs_import.xls">Download example excel input</a>
										</div>
									</div><!-- /.box-body -->
									<div class="box-body">
										<div class="form-group">
											<label for="Group">Project Group</label>
											<?php
						echo $html->getMultipleSelectBox($groups, 'group_id', 'name', 'id');
						?>
											<p class="help-block">Please select a group you belong for this project</p>
										</div>
									</div><!-- /.box-body -->
					<div class="box-body">
										<div class="form-group">
											<label for="Group">Who can see?</label>
											<?php
						$radiofields=array(
								array('name' => 'only me', 'value' => '3', 'selected' => ''),
								array('name' => 'only my group', 'value' => '15', 'selected' => 'checked'),
								array('name' => 'everyone', 'value' => '32', 'selected' => ''));
						echo $html->getRadioBox($radiofields, 'security_id', 'name');
						?>
											<p class="help-block">Please select the security credentials for this import</p>
										</div>
									</div><!-- /.box-body -->
									<div class="box-footer">
										<button type="submit" class="btn btn-primary">Submit</button>
									</div>
								</form>
