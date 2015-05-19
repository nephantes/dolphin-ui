				<section class="content">
					<?php echo $html->getBasePath(BASE_PATH, API_PATH); ?>
					<div class="row">
						<!-- left column -->
						<div class="col-md-3">
							<!-- general form elements -->
							<div class="box box-primary">
								<div class="box-header">
									<h3 class="box-title">Control Panel</h3>
								</div><!-- /.box-header -->
								<div class="box-body">
								<!-- form start -->
								<form>
									<div id=" box-body left">
									<table id="controller" class="table table-striped">
										<tbody>
										<tr>
											<td ><b>Source</b></td>
											<td>
												<select type="text" id="source_1" class="form-control">
													<option disabled>Select a Source</option>
												</select>
											</td>
										</tr>
										<tr style="display:none">
											<td id="source_input"><b>Source</b><br><span style="font-size:8px">URL or Google Sheet ID</span></td>
											<td>
												 <textarea id="source" class="form-control" rows="5" cols="20" placeholder="http://galaxyweb.umassmed.edu/galaxy/ak97w/dene/all.tsv"></textarea>
											</td>
										</tr>
										<tr>
											<td>X axis<br>(Log)<input type="checkbox" id="xi_scale" value="log scale" disabled checked> </td>
											<td>
												<select type="text" id="xi" class="form-control"></select>
											</td>
										</tr>
										<tr>
											<td >Y axis<br> 
											(Log)<input type="checkbox" id="yi_scale" value="log scale" disabled checked> 
											</td>
											<td>
												<select type="text" id="yi" class="form-control"></select>
											</td>
										</tr>
										<tr>
											<td>Pseudo Count</td>
											<td><input type="number" id="pseudocount" placeholder=1 class="form-control"></input></td>
										</tr>
										<tr>
											<td> Color axis 1</td>
											<td>
												<select type="text" id="zi" class="form-control"></select>
											</td>
										</tr>
										<tr style="display:none">
											<td>Color axis type 1</td>
											<td>
												<select type="text" id="zi_type" class="form-control">
													<option value="value">value</option>
													<option value="category">category</option>
												</select>
											</td>
										</tr>
										<tr>
											<td> Color axis 2</td>
											<td>
												<select type="text" id="zi" class="form-control"></select>
											</td>
										</tr>
										<tr style="display:none">
											<td>Color axis type 2</td>
											<td>
												<select type="text" id="zi_type_2" class="form-control">
													<option value="value">value</option>
													<option value="category">category</option>
												</select>
											</td>
										</tr>
										<tr id="zi_value_slide">
											<td>Color axis threshold</td>
											<td>
												<label for=cutoff>Threshold</label>
												<input id="zi_value_cutoff" type=range min=0 max=1 value=0.01 step=0.001 id=cutoff class="form-control">
											</td>
										</tr>
										<tr>
											<td></td>
											<td>
												<input type="hidden" id="sql" style="width:250px" placeholder="select * "></input>
												<text id="zi_value"></text>
											</td>
										</tr>
										<tr>
											<td>
												<label>Selected Columns</label>
											</td>
											<td>
												<select id="selected_cols" class="form-control" size="8" multiple="multiple" tabindex="1"></select>
											</td>
										</tr>
										</tbody>
									</table>
									<div>
										<h3>Query Genes</h3>
										<div>
											<textarea id="mytextarea" class="form-control" rows="10"></textarea>
											<br>
										</div>
										<div>
											<input id="highlight_gene" type="button" class="btn btn-primary" value="Submit"/>
											<input id="reset_gene" type="button" class="btn btn-primary" value="Reset"/>
										</div>
									</div>
									<div id="sconsole">
										<h3 id="gene_source">Selection Source</h3>
										<div id="console">
											<div id="console3"></div>
										</div>
									</div>
										<div id="console2"></div>
								</div>
					
								</form>
								</div>
							</div>
						</div>
						<!-- right column -->
						<div class="col-md-9">
							<!-- general form elements -->
							<div class="box box-primary">
								<div class="box-header">
									<h3 class="box-title">Plots</h3>
								</div><!-- /.box-header -->
								<div class="box-body">
								<!-- form start -->
								<form>
									<div class="box-body">
										<div id="canvas" class="margin"></div>
										<div id="table">
											<h3>Table</h3>
											<table id="output_table" class="table table-striped"></table>
										</div>
									</div><!-- /.box-body -->

									<div class="box-footer"></div>
								</form>
								</div>