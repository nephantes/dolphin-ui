		<!-- Content Header (Page header) -->
				<section class="content-header">
					<h1>
						Profile
						<small>Personal/Group information</small>
					</h1>
					<ol class="breadcrumb">
						<li><a href="<?php echo BASE_PATH?>"><i class="fa fa-dashboard"></i> Home</a></li>
			<li><a href="<?php echo BASE_PATH."/search"?>">Profile</a></li>
					</ol>
				</section>
				<!-- Main content -->
				<section class="content">
					<div class="row">
						<div class="col-md-12">
							<!-- general form elements -->
							<div class="box box-primary">
								<div class="box-header">
									
								</div><!-- /.box-header -->			
				<!-- form start -->
								<form role="form" enctype="multipart/form-data" action="profile" method="post">
									<div class="box-body margin">
										<div class="form-group" ">
											<div class="margin">
												<label><h3>Update your profile picture</h3></label>
											</div>
											<div class="margin">
												<img src="<?=BASE_PATH.'/public/img/avatar.png'?>" height="100px" width="100px" name="avatar_sel" class="img-circle" alt="av1" onclick="selectAvatar(this.alt)"/>
												<input id="av1" type="radio" name="avatar_select" value="/public/img/avatar.png">
												<img src="<?=BASE_PATH.'/public/img/avatar2.png'?>" height="100px" width="100px" name="avatar_sel" class="img-circle" alt="av2" onclick="selectAvatar(this.alt)" />
												<input id="av2" type="radio" name="avatar_select" value="/public/img/avatar2.png">
												<img src="<?=BASE_PATH.'/public/img/avatar3.png'?>" height="100px" width="100px" name="avatar_sel" class="img-circle" alt="av3" onclick="selectAvatar(this.alt)"/>
												<input id="av3" type="radio" name="avatar_select" value="/public/img/avatar3.png">
												<img src="<?=BASE_PATH.'/public/img/avatar5.png'?>" height="100px" width="100px" name="avatar_sel" class="img-circle" alt="av4" onclick="selectAvatar(this.alt)"/>
												<input id="av4" type="radio" name="avatar_select" value="/public/img/avatar5.png">
											</div>
											<br></br>
											<div class="margin">
												<label><h3>Update your Amazon Buckets</h3></label>
											</div>
											<div id="amazon_keys" class="margin">
												<?php echo $html->getRespBoxTable_ng("", "amazon", "<th>Bucket</th><th>Access Key</th><th>Secret Key</th>"); ?>
											</div>
										</div>
									</div><!-- /.box-body -->
									<div class="box-footer margin">
										<button type="button" id="changeAv" class="btn btn-primary" onclick="updateProfile()">Update</button>
									</div>
								</form>

