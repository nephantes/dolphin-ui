<!-- Content Header (Page header) -->
                <section class="content-header">
                    <h1>
                        NGS Pipeline 
                        <small>Workflow creation</small>
                    </h1>
                    <ol class="breadcrumb">
                        <li><a href="<?php echo BASE_PATH?>"><i class="fa fa-dashboard"></i> Home</a></li>
			<li><a href="<?php echo BASE_PATH."/search"?>">NGS Pipeline</a></li>
			<li class="active"><?php echo $field?></li
                    </ol>
                </section>
                <!-- Main content -->
                <section class="content">
                    <div class="row">
                        <div class="col-md-12">
			    <?php echo $html->sendJScript("selected", "", "", ""); ?>
                            <?php echo $html->getRespBoxTable_ng("Samples Selected", "samples", "<th>id</th><th>Title</th><th>Source</th><th>Organism</th><th>Molecule</th>"); ?>
                        </div><!-- /.col (RIGHT) -->
                    </div><!-- /.row -->
                    <div class="row">
                        <div class="col-md-4">
                            <div class="box">
                                <div class="box-header with-border">
                                  <h3 class="box-title">Options</h3>
                                </div><!-- /.box-header -->
                                <div class="box-body">
                                    <?php echo $html->getSelectionBox("Genome build",
                                                                                    '<option>hg19</option>
                                                                                    <option value="rn5">rn5</option>
                                                                                    <option value="danRer7">danRer7</option>
                                                                                    <option value="mm10">mm10</option>
                                                                                    <option value="mm10test">mm10test</option>
                                                                                    <option value="sacCer3">sacCer3</option>
                                                                                    <option value="ce10">ce10</option>
                                                                                    <option value="bosTau7">bosTau7</option>
                                                                                    <option value="dm3">dm3</option>')?>
                                    <?php echo $html->getSelectionBox("Library Mate-paired?",
                                                                                    '<option>Yes</option>
                                                                                    <option>No</option>')?>
                                    <?php echo $html->getSelectionBox("Fresh Run?",
                                                                                    '<option>Yes</option>
                                                                                    <option>No</option>')?>
                                    <?php echo $html->getSelectionBox("Adapter Removal?",
                                                                                    '<option>Yes</option>
                                                                                    <option>No</option>')?>
                                </div><!-- /.box-body -->
                              </div><!-- /.box -->
                        </div><!-- /.col (LEFT) -->
                        <div class="col-md-4">
                            <div class="box">
                                <div class="box-header with-border">
                                  <h3 class="box-title">Options</h3>
                                </div><!-- /.box-header -->
                                <div class="box-body">
                                    <?php echo $html->getSelectionBox("Barcode Separation?",
                                                                                    '<option>Yes</option>
                                                                                    <option>No</option>')?>
                                    <?php echo $html->getSelectionBox("FastQC Reports?",
                                                                                    '<option>Yes</option>
                                                                                    <option>No</option>')?>
                                    <?php echo $html->getSelectionBox("Quality Filtering?",
                                                                                    '<option>Yes</option>
                                                                                    <option>No</option>')?>
                                    <?php echo $html->getSelectionBox("Trimming?",
                                                                                    '<option>Yes</option>
                                                                                    <option>No</option>')?>

                                </div><!-- /.box-body -->
                              </div><!-- /.box -->
                        </div><!-- /.col (CENTER) -->
                        <div class="col-md-4">
                            <div class="box">
                                <div class="box-header with-border">
                                  <h3 class="box-title">Options</h3>
                                </div><!-- /.box-header -->
                                <div class="box-body">
                                    <?php echo $html->getSelectionBox("Split FastQ?",
                                                                                    '<option>Yes</option>
                                                                                    <option>No</option>')?>
                                    <?php echo $html->getSelectionBox("Clean Intermediate Files?",
                                                                                    '<option>Yes</option>
                                                                                    <option>No</option>')?>
                                    <?php echo $html->getSelectionBox("Common RNAs?",
                                                                                    '<option>Yes</option>
                                                                                    <option>No</option>')?>
                                </div><!-- /.box-body -->
                              </div><!-- /.box -->
                        </div><!-- /.col (RIGHT) -->
                    </div><!-- /.row -->
                </section><!-- /.content -->
                