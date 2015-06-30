		<!-- Content Header (Page header) -->
				<section class="content-header">
					<h1>
						NGS Browser
						<small>Project and experiment search</small>
					</h1>
					<ol class="breadcrumb">
						<li><a href="<?php echo BASE_PATH?>"><i class="fa fa-dashboard"></i> Home</a></li>
						<li><a href="<?php echo BASE_PATH."/search"?>">NGS Browser</a></li>
			<li class="active"><?php echo $field?></li>
					</ol>
				</section>
				<?php echo $html->getBasePath(BASE_PATH, API_PATH); ?>
				<!-- Main content -->
				<section class="content">
					<div class="row">
						<div class="col-md-3">

			<div class="box box-solid">
				<div class="box-header with-border">
				<h3 class="box-title">Browse</h3>
		<div class="panel-tools pull-right">
			<button class="btn btn-primary" onclick="returnToIndex();">
				<i class="fa fa-fast-backward"></i>
			</button>
			</div>
				</div><!-- /.box-header -->
				<div class="box-body">
				<div class="box-group" id="accordion">
					<!-- we are adding the .panel class so bootstrap.js collapse plugin detects it -->
					<?php echo $html->sendJScript($segment, $table, $value, $search, $uid, $gids); ?>
					<?php echo $html->getAccordion("Assay", $assay, $search)?>
					<?php echo $html->getAccordion("Organism", $organism, $search)?>
					<?php echo $html->getAccordion("Molecule", $molecule, $search)?>
					<?php echo $html->getAccordion("Source", $source, $search)?>
					<?php echo $html->getAccordion("Genotype", $genotype, $search)?>
				</div>
				</div><!-- /.box-body -->
		</div><!-- /.box -->
		<div>
			<?php echo $html->getDolphinBasket()?>
		</div>
		<!-- END ACCORDION & CAROUSEL-->
			</div><!-- /.col (LEFT) -->
						<div class="col-md-9">
				<?php echo $html->getRespBoxTableStream("Experiment Series", "experiments", ["id","Series Name","Summary","Design"], ["id","name","summary","design"]); ?>
				<?php echo $html->getRespBoxTableStream("Imports", "lanes", ["id","Import Name","Facility","Total Reads","Total Samples","Selected"], ["id","name","facility", "total_reads", "total_samples",""]); ?>
				<?php echo $html->getRespBoxTableStream("Samples", "samples", ["id","Sample Name","Title","Source","Organism","Molecule","Selected"], ["id","name","title","source","organism","molecule","total_reads"]); ?>
				<?php echo $html->getSubmitBrowserButton()?>
						</div><!-- /.col (RIGHT) -->
					</div><!-- /.row -->
				</section><!-- /.content -->



