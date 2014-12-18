		<!-- Content Header (Page header) -->
                <section class="content-header">
                    <h1>
                        Experiment Series
                        <small>NGS Tracking</small>
                    </h1>
                    <ol class="breadcrumb">
                        <li><a href="<?php echo BASE_PATH?>"><i class="fa fa-dashboard"></i> Home</a></li>
                        <li><a href="<?php echo BASE_PATH."/ngstrack"?>"></a>NGS Tracking</li>
                        <li class="active">Experiment Series</li>
                    </ol>
                </section>
	        <div class="container">
                <!-- Main content -->
                <section class="content">
                    <div class="row">
                        <div class="info">
                                <a id="descLink" onclick="toggleTable();" href="#">Click </a> to see the description of each field in the table.<br>
                                <table id="descTable" class="display" style="display:none" cellspacing="0" width="100%">
                                <thead>
                                   <tr>
                                     <th></th>
                                     <th>Summary</th>
                                </thead>
                                <tbody>
                                <tr><th>Title:</th><td> Unique title that describes the overall study.</td></tr> 
				<tr><th>Summary:</th><td> Thorough description of the goals and objectives of this study. The abstract from the associated publication may be suitable. Include as much text as necessary.</td></tr>
				<tr><th>Overall Design:</th><td> Indicate how many Samples are analyzed, if replicates are included, are there control and/or reference Samples, etc.</td></tr>
				</table>
				</p>
                        </div>

                        <table id="example" class="display" cellspacing="0" width="100%">
                                <thead>
                                        <tr>
                                                <th>Title</th>
                                                <th>Summary</th>
                                                <th>Overall Design</th>
                                        </tr>
                                </thead>
                        </table>
			
                    </div><!-- /.row -->
                </section><!-- /.content -->
                
       </div>        

