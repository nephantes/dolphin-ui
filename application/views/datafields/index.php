		<!-- Content Header (Page header) -->
                <section class="content-header">
                    <h1>
                        Data Fields
                        <small>Admin</small>
                    </h1>
                    <ol class="breadcrumb">
                        <li><a href="<?php echo BASE_PATH?>"><i class="fa fa-dashboard"></i> Home</a></li>
                        <li><a href="<?php echo BASE_PATH."/admin"?>"></a>Administration</li>
                        <li class="active">Data Fields</li>
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
				<tr><th>Datatable:</th><td>Name of the data table</td></tr> 
				<tr><th>Tablename:</th><td>Table name of the field</td></tr>
				<tr><th>Fieldname:</th><td>Name of the field</td></tr>
				<tr><th>Title:</th><td>The title of the field that is going to be shown in the html presentation</td></tr>
				<tr><th>Summary:</th><td>Short explanation of the field</td></tr>
				<tr><th>Type:</th><td>Type of the field. Text, Date, blob, etc.</td></tr>
				<tr><th>Len:</th><td>Length of the field that is going to be used to set box size in the html</td></tr>
				<tr><th>Joined Table Name</th><td>If the main table is going to be joined other table, describe its name</td></tr>
				<tr><th>Joined Field ID Name</th><td>The name of the field that is going to be used in left join. Ex: Usually id</td></tr> 
				<tr><th>Joined Target Field</th><td>The value field that are going to be used in the box or html rather than id.</td></tr> 
				</tbody>
				</table>
				</p>
                        </div>
			</br>
			</br>

                        <table id="datafields" class="display" cellspacing="0" width="100%">
                                <thead>
                                        <tr>
                                	<th>Datatable</th>
                                	<th>Tablename</th>
                                	<th>Fieldname</th>
                                	<th>Title</th>
                                	<th>Summary</th>
                                	<th>Type</th>
                                	<th>Len</th>
                                	<th>Joined Table Name</th>
                                	<th>Joined Field ID Name</th>
                                	<th>Joined Target Field</th>
                                        </tr>
                                </thead>
                        </table>
			
                    </div><!-- /.row -->
                </section><!-- /.content -->
                
       </div>        

