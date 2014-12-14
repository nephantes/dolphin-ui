                <section class="content">
                    <div class="row">
                        <!-- left column -->
                        <div class="col-md-6">
                            <!-- general form elements -->
                            <div class="box box-primary">
                                <div class="box-header">
                                    <h3 class="box-title">Excel Import</h3>
                                </div><!-- /.box-header -->
                                <div class="box-body">
                                    <div>				
				<!-- form start -->
                                <form role="form" enctype="multipart/form-data" action="ngsimport/process" method="post">
                                    <div class="box-body">
                                        <div class="form-group">
                                            <label for="inputDir">Input Directory in the Cluster</label>
                                            <input name="inputDir" type="input" class="form-control" id="inputDir" placeholder="Enter Director
y">
                                            <p class="help-block">Please enter full path of the fastq files in your project space in the clust
er.</p>
                                        </div>
                                        <div class="form-group">
                                            <label for="excelInputFile">Excel file input</label>
                                            <input type="file" name="excelFile" id="excelFile">
                                            <p class="help-block">Please choose excel file from your device.</p>
                                        </div>
                                    </div><!-- /.box-body -->

                                    <div class="box-footer">
                                        <button type="submit" class="btn btn-primary">Submit</button>
                                    </div>
                                </form>
