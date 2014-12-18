		<!-- Content Header (Page header) -->
                <section class="content-header">
                    <h1>
                        Fastq Files
                        <small>NGS Tracking</small>
                    </h1>
                    <ol class="breadcrumb">
                        <li><a href="<?php echo BASE_PATH?>"><i class="fa fa-dashboard"></i> Home</a></li>
                        <li><a href="<?php echo BASE_PATH."/ngstrack"?>"></a>NGS Tracking</li>
                        <li class="active">Fastq Files</li>
                    </ol>
                </section>
	        <div class="container">
                <!-- Main content -->
                <section class="content">
                    <div class="row">
                        <div class="info">
                                <p><a id="descLink" onclick="toggleTable();" href="#">Click </a> to see the description of each field in the table.<br>
				<table id="descTable" class="display" style="display:none" cellspacing="0" width="100%">
                                <thead>
                                   <tr>
                                     <th width="150px"></th>
                                     <th>Summary</th>
                                </thead>
                                <tbody>
				<tr><th>Lane Name:</th><td>The name that describes the lane. </td></tr>
				<tr><th>Sample Name:</th><td>The title that describes sample</td></tr> 
				<tr><th>Fastq Dir:</th><td>The directory of the fastq files </td></tr>
				<tr><th>Sample Name:</th><td>Unique name that describes the sample. Please don't use any characters other than numbers, letters and udnerscore </td></tr>
				<tr><th>CheckSum:</th><td>MD5 checksum of the file. This helps us verify that the file transfer was complete and didn't corrupt your file.</td></tr>
				</tbody>
				</table>
				</p>
                        </div>
			</br>
			</br>

                        <table id="fastqfiles" class="display" cellspacing="0" width="100%">
                                <thead>
                                        <tr>
                                	<th>Lane Name</th>
                                	<th>Sample Name</th>
                                	<th>Fastq Dir</th>
                                	<th>CheckSum</th>
                                        </tr>
                                </thead>
                        </table>
			
                    </div><!-- /.row -->
                </section><!-- /.content -->
                
       </div>        

