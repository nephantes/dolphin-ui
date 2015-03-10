		<!-- Content Header (Page header) -->
                <section class="content-header">
                    <h1>
                        NGS Tracking
                        <small>Project and experiment tracking</small>
                    </h1>
                    <ol class="breadcrumb">
                        <li><a href="<?php echo BASE_PATH?>"><i class="fa fa-dashboard"></i> Home</a></li>
                        <li><a href="<?php echo BASE_PATH."/ngstrack"?>"></a>NGS Tracking</li>
                        <li class="active">Dashboard</li>
                    </ol>
                </section>
                <!-- Main content -->
                <section class="content">
                    <div class="row">
                        <div class="col-md-6">
                             <?php echo $html->getBoxTable_ng("Experiment Series", "experiment_series", "<th>id</th><th>Name</th><th>Summary</th><th>Design</th>"); ?>
                             <?php echo $html->getBoxTable_ng("Protocols", "protocols", "<th>id</th><th>Name</th><th>Growth</th><th>Treatment</th>"); ?>
                        </div><!-- /.col (LEFT) -->
                        <div class="col-md-6">
                            <?php echo $html->getBoxTable_ng("Lanes", "lanes", "<th>id</th><th>Lane name</th><th>Facility</th><th>Total Reads</th><th>Total Samples</th>"); ?>
                            <?php echo $html->getBoxTable_ng("Samples", "samples", "<th>id</th><th>Title</th><th>Source</th><th>Organism</th><th>Molecule</th>"); ?>
                        </div><!-- /.col (RIGHT) -->
                    </div><!-- /.row -->
                </section><!-- /.content -->
                
                

