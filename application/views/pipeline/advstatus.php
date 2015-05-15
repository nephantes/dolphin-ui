				<section class="content-header">
					<h1>NGS Run Status<small>Advanced status details</small></h1>
					<ol class="breadcrumb">
						<li><a href="<?php echo BASE_PATH?>"><i class="fa fa-dashboard"></i> Home</a></li>
						<li><a href="<?php echo BASE_PATH."/search"?>">NGS Pipeline</a></li>
						<li class="active"><?php echo $field?></li
					</ol>
				</section>
				<!-- Main content -->
				<section class="content">
					<div class="row">
						<?php echo $html->sendJScript('status', "", "", "", $uid, $gids); ?>
					</div><!-- /.row -->
				</section><!-- /.content -->