		<?php
		    
		    echo $html->getContentHeader($title, $parenttitle, $parentlink);
		?>

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

                        <table id="experimentseries" class="display" cellspacing="0" width="100%">
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

