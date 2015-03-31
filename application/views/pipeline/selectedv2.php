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
                            <?php echo $html->getRespBoxTable_ng("Samples Selected", "samples", "<th>id</th><th>Title</th><th>Source</th><th>Organism</th><th>Molecule</th>"); ?>
                        </div><!-- /.col (RIGHT) -->
                    </div><!-- /.row -->
                    <div class="row">
			<?php echo $html->sendJScript("selected", "", "", $selection); ?>
                        <?php echo $html->getStaticSelectionBox("Genome Build", "<option>hg19</option>
                                                                                <option>cho-k1</option>
                                                                                <option>rn5</option>
                                                                                <option>danRer7</option>
                                                                                <option>mm10</option>
                                                                                <option>mm10test</option>
                                                                                <option>sacCer3</option>
                                                                                <option>ce10</option>
                                                                                <option>bosTau7</option>
                                                                                <option>dm3</option>", 4)?>
                        <?php echo $html->getStaticSelectionBox("Mate-paired?", "<option>Yes</option>
                                                                                <option>No</option>", 4)?>
                        <?php echo $html->getStaticSelectionBox("Fresh Run?", "<option>Yes</option>
                                                                                <option>No</option>", 4)?>
                        <?php echo $html->getStaticSelectionBox("Output Directory", "TEXT", 6)?>
                        <?php echo $html->getStaticSelectionBox("FastQC?", "<option>Yes</option>
                                                                            </option>No</option>", 6)?>
                        <?php echo $html->getExpandingSelectionBox("Barcode Separation?", 2, 12, ["Distance","Format"], [[1,2,3,4,5],[
                                                                    "5' end, read 1","3' end, read 2 (or 3' end on single end)","Barcode is in header (Illumina Casava)",
                                                                    "No barcode on read 1 of a pair (read 2 must have on 5' end)",
                                                                    "Paired end, Both reads, 5' end"]])?>
                        <?php echo $html->getExpandingSelectionBox("Adapter Removal?", 1, 12, ["Adapter"], [["TEXTBOX"]])?>
                        <?php echo $html->getExpandingSelectionBox("Quality Filtering?", 5, 12, ["Window Size","Required Quality","leading","trailing","minlen"],
                                                                   [["TEXT","10"],["TEXT","15"],["TEXT","5"],["TEXT","5"],["TEXT","36"]])?>
                        <?php echo $html->getExpandingSelectionBox("Trimming?", 5, 12, ["Single or Paired-end?", "5' length/1", "3' length/1", "5' length/2", "3' length/2"],
                                                                   [["Single-end", "Paired-end"],["TEXT","0"],["TEXT","0"],["TEXT","0"],["TEXT","0"]])?>
                        <?php echo $html->getExpandingSelectionBox("Common RNAs?", 8, 12, ["ERCC","rRNA","miRNA","tRNA","snRNA","rmsk","Genome","Change Parameters"],
                                                                   [["No","Yes"],["No","Yes"],["No","Yes"],["No","Yes"],["No","Yes"],["No","Yes"],["No","Yes"],["No","Yes"]])?>
                        <?php echo $html->getExpandingSelectionBox("Split FastQ?", 1, 12, ["Number of reads per file"], [["TEXT","5000000"]])?>
                        <div class="col-md-4">
                        <input type="button" id="MEGATEST" class="btn btn-primary" name="pipeline_send_button" value="Submit Pipeline"/>
                        </div>
                    </div><!-- /.row -->
                </section><!-- /.content -->
                