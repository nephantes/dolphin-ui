		<!-- Content Header (Page header) -->
                <section class="content-header">
                    <h1>
                        File locations and backups
                        <small>NGS Tracking</small>
                    </h1>
                    <ol class="breadcrumb">
                        <li><a href="<?php echo BASE_PATH?>"><i class="fa fa-dashboard"></i> Home</a></li>
                        <li><a href="<?php echo BASE_PATH."/ngstrack"?>"></a>NGS Tracking</li>
                        <li class="active">File Locations and Backups</li>
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
				<tr><th>Fastq Dir:</th><td>Full path of the fastq files. </td></tr>
				<tr><th>Backup Dir:</th><td>Full path of the backup directiory</td></tr> 
				<tr><th>Amazon Bucket:</th><td>Amazon bucket name. If this field is not empty and amazon bucket exits under your credentials and your amazon credentials are defined in the system. The fastq files are going to be copied to Amazon S3 storage.</td></tr>
				</tbody>
				</table>
				</p>
                        </div>
			</br>
			</br>

                        <table id="dirs" class="display" cellspacing="0" width="100%">
                                <thead>
                                        <tr>
                                	<th>Fastq Dir</th>
                                	<th>Backup Dir</th>
                                	<th>Amazon Bucket</th>
                                        </tr>
                                </thead>
                        </table>
			
                    </div><!-- /.row -->
                </section><!-- /.content -->
                
       </div>        

