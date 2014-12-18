		<!-- Content Header (Page header) -->
                <section class="content-header">
                    <h1>
                        Samples
                        <small>NGS Tracking</small>
                    </h1>
                    <ol class="breadcrumb">
                        <li><a href="<?php echo BASE_PATH?>"><i class="fa fa-dashboard"></i> Home</a></li>
                        <li><a href="<?php echo BASE_PATH."/ngstrack"?>"></a>NGS Tracking</li>
                        <li class="active">Samples</li>
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
				<tr><th>Lane Name:</th><td>The name that describes the lane. </td></tr>
				<tr><th>Protocol Name:</th><td>The name that describes the lane. </td></tr>
				<tr><th>Sample Name:</th><td>Unique name that describes the sample. Please don't use any characters other than numbers, letters and udnerscore </td></tr>
				<tr><th>Barcode:</th><td>Describe the facility you used for sequencing</td></tr>
				<tr><th>Title:</th><td>Unique title that describes the Sample.</td></tr>
				<tr><th>Source:</th><td>Briefly identify the biological material, cell line or tissue e.g., vastus lateralis muscle.</td></tr>
				<tr><th>Organism:</th><td>Identify the organism(s) from which the sequences were derived.</td></tr>
				<tr><th>Molecule:</th><td>Type of molecule that was extracted from the biological material. Include one of the following: total RNA, polyA RNA, cytoplasmic RNA, nuclear RNA, genomic DNA, protein, or other.</td></tr>
				<tr><th>Description:</th><td>Detailed sample description</td></tr>
				<tr><th>Instrument Model:</th><td>The model of the next generation sequencing machine</td></tr>
				<tr><th>Avg. Insert Size:</th><td>Average size of the insert for paired-end reads (excluding adapters, linkers, etc...)</td></tr>
				<tr><th>Read Length:</th><td>Sequenced read length</td></tr>
				<tr><th>Genotype:</th><td>Describe the genetic makeup of a specific organism</td></tr>
				<tr><th>Condition:</th><td>Describe the sample condition</td></tr>
				<tr><th>Library Type:</th><td>Library Type</td></tr>
				<tr><th>3' Adapter:</th><td>3' Adapter sequence</td></tr>
				<tr><th>Notebook Ref:</th><td>Corresponding notebook reference of the sample</td></tr>
				<tr><th>Notes:</th><td>Free text notes field to describe the lane</td></tr>
				</tbody>
				</table>
				</p>
                        </div>
			</br>
			</br>

                        <table id="samples" class="display" cellspacing="0" width="100%">
                                <thead>
                                        <tr>
					<th>Series Name</th>
                                	<th>Lane Name</th>
                                	<th>Protocol Name</th>
                                	<th>Sample Name</th>
                                	<th>Barcode</th>
                                	<th>Title</th>
                                	<th>Source</th>
                                	<th>Organism</th>
                                	<th>Molecule</th>
                                	<th>Description</th>
                                	<th>Instrument Model</th>
                                	<th>Avg. Insert Size</th>
                                	<th>Read Length</th>
                                	<th>Genotype</th>
                                	<th>Condition</th>
                                	<th>Library Type</th>
                                	<th>3' Adapter</th>
                                	<th>Notebook Ref</th>
                                	<th>Notes</th>
                                        </tr>
                                </thead>
                        </table>
			
                    </div><!-- /.row -->
                </section><!-- /.content -->
                
       </div>        

