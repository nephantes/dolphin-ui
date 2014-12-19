		<!-- Content Header (Page header) -->
                <section class="content-header">
                    <h1>
                        Data Tables
                        <small>Admin</small>
                    </h1>
                    <ol class="breadcrumb">
                        <li><a href="<?php echo BASE_PATH?>"><i class="fa fa-dashboard"></i> Home</a></li>
                        <li><a href="<?php echo BASE_PATH."/admin"?>"></a>Administration</li>
                        <li class="active">Data Tables</li>
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
				<tr><th>Name:</th><td>Name of the data table. </td></tr>
				<tr><th>Parent Name:</th><td>Name of the parent for bread crumbs</td></tr> 
				<tr><th>Parent Link:</th><td>The link of the parent for bread crumbs</td></tr>
				<tr><th>Ajax:</th><td>Ajax link to manupilate the data</td></tr>
				<tr><th>Datatable Name:</th><td>Data table name in html form</td></tr>
				<tr><th>Main mysql table:</th><td>Main mysql table to generate the datatable</td></tr>
				<tr><th>Joined:</th><td>(Yes/No) Yes: if there are other tables that are going to be joined(left)</td></tr>
				</tbody>
				</table>
				</p>
                        </div>
			</br>
			</br>

                        <table id="datatables" class="display" cellspacing="0" width="100%">
                                <thead>
                                        <tr>
                                	<th>Name</th>
                                	<th>Parent Name</th>
                                	<th>Parent Link</th>
                                	<th>Ajax</th>
                                	<th>Datatable Name</th>
                                	<th>Main mysql table</th>
                                	<th>Joined</th>
                                        </tr>
                                </thead>
                        </table>
			
                    </div><!-- /.row -->
                </section><!-- /.content -->
                
       </div>        

