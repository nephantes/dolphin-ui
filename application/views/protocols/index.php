		<!-- Content Header (Page header) -->
                <section class="content-header">
                    <h1>
                        Protocols
                        <small>NGS Tracking</small>
                    </h1>
                    <ol class="breadcrumb">
                        <li><a href="<?php echo BASE_PATH?>"><i class="fa fa-dashboard"></i> Home</a></li>
                        <li><a href="<?php echo BASE_PATH."/ngstrack"?>"></a>NGS Tracking</li>
                        <li class="active">Protocols</li>
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
                                     <th></th>
                                     <th>Summary</th>
				</thead>				
				<tbody>
				<tr><th>Protocol Name:</th><td>Unique protocol name that describes the overall protocol.<td></tr> 
				<tr><th>Growth Protocol:</th><td>Describe the conditions that were used to grow or maintain organisms or cells prior to extract preparation.<td></tr>
				<tr><th>Treatment Protocol:</th><td>Describe the treatments applied to the biological material prior to extract preparation.<td></tr>
				<tr><th>Extract Protocol:</th><td>Describe the protocols used to extract and prepare the material to be sequenced.<td></tr>
				<tr><th>Library Construction Protocol:</th><td>Describe the library construction protocol.<td></tr>
				<tr><th>Library Strategy:</th><td>A Short Read Archive-specific field that describes the sequencing technique for this library.<td></tr> 
				</table>
                        </div>
<p>
                        <table id="protocols" class="display" cellspacing="0" width="100%">
                                <thead>
                                        <tr>
                                                <th>Protocol Name</th>
                                                <th>Growth Protocol</th>
                                                <th>Treatment Protocol</th>
                                                <th>Extract Protocol</th>
                                                <th>Library Construction Protocol</th>
                                                <th>Library Strategy</th>
                                        </tr>
                                </thead>
                        </table>
</p>			
                    </div><!-- /.row -->
                </section><!-- /.content -->
                
       </div>        

