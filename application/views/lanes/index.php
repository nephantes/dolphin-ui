		<!-- Content Header (Page header) -->
                <section class="content-header">
                    <h1>
                        Lanes
                        <small>NGS Tracking</small>
                    </h1>
                    <ol class="breadcrumb">
                        <li><a href="<?php echo BASE_PATH?>"><i class="fa fa-dashboard"></i> Home</a></li>
                        <li><a href="<?php echo BASE_PATH."/ngstrack"?>"></a>NGS Tracking</li>
                        <li class="active">Lanes</li>
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
                                     <th width="150px"></th>
                                     <th>Summary</th>
                                </thead>
                                <tbody>
				<tr><th>Series Name:</th><td>The title that describes the overall study.</td></tr> 
				<tr><th>Lane Name:</th><td>Unique name that describes the lane. </td></tr>
				<tr><th>Sequencing Facility:</th><td>Describe the facility you used for sequencing</td></tr>
				<tr><th>Cost:</th><td>Sequencing cost of the lane</td></tr>
				<tr><th>Date submitted:</th><td>Submission date</td></tr>
				<tr><th>Date received:</th><td>Received date</td></tr>
				<tr><th>Total reads:</th><td>Total # of sequenced reads in the lane</td></tr>
				<tr><th>% PhiX requested:</th><td>(Yes/No) - Illumina recommends using PhiX Control v3 (Catalog # FC-110-3001) in a lowconcentration spike-in (1%) for improved sequencing quality control</td></tr>
				<tr><th>% PhiX in lane:</th><td>Spike-in concentration (%)</td></tr>
				<tr><th># of Samples:</th><td>The number of sampels in the lane</td></tr>
				<tr><th>Resequenced?:</th><td>(Yes/No) - Is this resequenced library?</td></tr>
				<tr><th>Notes:</th><td>Free text notes field to describe the lane</td></tr>
				</tbody>
				</table>
				</p>
                        </div>
			</br>
			</br>

                        <table id="lanes" class="display" cellspacing="0" width="100%">
                                <thead>
                                        <tr>
                                                <th>Series Name</th>
                                                <th>Lane Name</th>
                                                <th>Facility</th>
                                                <th>Cost</th>
                                                <th>Date submitted</th>
                                                <th>Date received</th>
                                                <th>Total reads</th>
                                                <th>% PhiX requested</th>
                                                <th>% PhiX in lane</th>
                                                <th># of Samples</th>
                                                <th>Resequenced?</th>
                                                <th>Notes</th>
                                        </tr>
                                </thead>
                        </table>
			
                    </div><!-- /.row -->
                </section><!-- /.content -->
                
       </div>        

