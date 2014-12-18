		<!-- Content Header (Page header) -->
                <section class="content-header">
                    <h1>
                        Contributors
                        <small>NGS Tracking</small>
                    </h1>
                    <ol class="breadcrumb">
                        <li><a href="<?php echo BASE_PATH?>"><i class="fa fa-dashboard"></i> Home</a></li>
                        <li><a href="<?php echo BASE_PATH."/ngstrack"?>"></a>NGS Tracking</li>
                        <li class="active">Contributors</li>
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
				<tr><th>Contributor:</th><td> Contibutor name. </td></tr>
				</table>
                        </div>

			<p>
                        <table id="contributors" class="display" cellspacing="0" width="100%">
                                <thead>
                                        <tr>
                                                <th>Series Name</th>
                                                <th>Contributor Name</th>
                                        </tr>
                                </thead>
                        </table>
			</p>
                    </div><!-- /.row -->
                </section><!-- /.content -->
                
       </div>        

