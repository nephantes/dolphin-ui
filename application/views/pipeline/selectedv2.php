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
                        <?php echo $html->getStaticSelectionBox("Name the Run", "run_name", "TEXT", 4)?>
			<?php echo $html->getStaticSelectionBox("Description", "description", "TEXT", 8)?>
			<?php echo $html->getStaticSelectionBox("Genome Build", "genomebuild", "<option>hg19</option>
                                                                                <option>cho-k1</option>
                                                                                <option>rn5</option>
                                                                                <option>danrer7</option>
                                                                                <option>mm10</option>
                                                                                <option>mm10test</option>
                                                                                <option>saccer3</option>
                                                                                <option>ce10</option>
                                                                                <option>bostau7</option>
                                                                                <option>dm3</option>", 4)?>
                        <?php echo $html->getStaticSelectionBox("Mate-paired", "spaired", "<option>yes</option>
                                                                                <option>no</option>", 4)?>
                        <?php echo $html->getStaticSelectionBox("Fresh Run", "resume", "<option>yes</option>
                                                                                <option>no</option>", 4)?>
                        <?php echo $html->getStaticSelectionBox("Output Directory", "outdir", "TEXT", 8)?>
                        <?php echo $html->getStaticSelectionBox("FastQC", "fastqc", "<option>yes</option>
                                                                            <option>no</option>", 4)?>
                        <?php echo $html->getExpandingSelectionBox("Barcode Separation", "barcodes", 2, 6, ["distance","format"], [[1,2,3,4,5],[
                                                                    "5 end read 1","3 end read 2 (or 3 end on single end)","barcode is in header (illumina casava)",
                                                                    "no barcode on read 1 of a pair (read 2 must have on 5 end)",
                                                                    "paired end both reads 5 end"]])?>
                        <?php echo $html->getExpandingSelectionBox("Adapter Removal", "adapter", 1, 6, ["adapter"], [["TEXTBOX"]])?>
                        <?php echo $html->getExpandingSelectionBox("Quality Filtering", "quality", 5, 6, ["window size","required quality","leading","trailing","minlen"],
                                                                   [["TEXT","10"],["TEXT","15"],["TEXT","5"],["TEXT","5"],["TEXT","36"]])?>
                        <?php echo $html->getExpandingSelectionBox("Trimming", "trim", 5, 6, ["single or paired-end", "5 length 1", "3 length 1", "5 length 2", "3 length 2"],
                                                                   [["single-end", "paired-end"],["TEXT","0"],["TEXT","0"],["TEXT","0"],["TEXT","0"]])?>
                        <?php echo $html->getExpandingSelectionBox("Common RNAs", "commonind", 8, 6, ["ercc","rrna","mirna","trna","snrna","rmsk","genome","change parameters"],
                                                                   [["no","yes"],["no","yes"],["no","yes"],["no","yes"],["no","yes"],["no","yes"],["no","yes"],["no","yes"]])?>
                        <?php echo $html->getExpandingSelectionBox("Split FastQ", "split", 1, 6, ["number of reads per file"], [["TEXT","5000000"]])?>
                        <?php echo $html->getExpandingSelectionBox("Additional Pipelines", "pipeline", 1, 6, ["Add a Pipeline"], [["BUTTON"]])?>
			<div class="col-md-4">
                        <input type="button" id="submitPipeline" class="btn btn-primary" name="pipeline_send_button" value="Submit Pipeline" onClick="submitPipeline('selected');"/>
                        </div>
                    </div><!-- /.row -->
                </section><!-- /.content -->
                