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
									<h3 class="box-title">Choose your Avatar</h3>
								</div><!-- /.box-header -->
								<div class="box-body">
									<div>				
				<!-- form start -->
								<form role="form" enctype="multipart/form-data" action="ngsimport/process" method="post">
									<div class="box-body">
										<div class="form-group">
											<div class="col-md-3" id="av1"><img src="<?=BASE_PATH.'/img/avatar'?>" class="img-circle" alt="av1" onclick="selectAvatar(this.src)"/></div>
											<div class="col-md-3" id="av2"><img src="<?=BASE_PATH.'/img/avatar2'?>" class="img-circle" alt="av2" onclick="selectAvatar(this.src)" /></div>
											<div class="col-md-3" id="av3"><img src="<?=BASE_PATH.'/img/avatar3'?>" class="img-circle" alt="av3" onclick="selectAvatar(this.src)"/></div>
											<div class="col-md-3" id="av4"><img src="<?=BASE_PATH.'/img/avatar5'?>" class="img-circle" alt="av4" onclick="selectAvatar(this.src)"/></div>
											</ul>
										</div>
									</div><!-- /.box-body -->
									<div class="box-footer">
										<button type="button" id="changeAv" class="btn btn-primary" onclick="changeAvatar()">Change</button>
									</div>
								</form>


