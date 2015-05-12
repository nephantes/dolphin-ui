				<section class="content">
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
											<td id="source_input"><b>Source</b><br><span style="font-size:8px">URL or Google Sheet ID</span></td>
											<td>
												 <textarea id="source" rows="5" cols="20" placeholder="http://galaxyweb.umassmed.edu/galaxy/ak97w/dene/all.tsv">http://galaxyweb.umassmed.edu/galaxy/ak97w/dene/alldetected.tsv</textarea>
											</td>
										</tr>
										<tr>
											<td>X axis<br>(Log)<input type="checkbox" id="xi_scale" value="log scale" checked> </td>
											<td>
												<select type="text" id="xi"></select>
											</td>
										</tr>
										<tr>
											<td >Y axis<br> 
											(Log)<input type="checkbox" id="yi_scale" value="log scale" checked> 
											</td>
											<td>
												<select type="text" id="yi"></select>
											</td>
										</tr>
										<tr>
											<td>Pseudo Count</td>
											<td><input type="number" id="pseudocount" placeholder=1></input></td>
										</tr>
										<tr>
											<td> Color axis</td>
											<td>
												<select type="text" id="zi"></select>
											</td>
										</tr>
										<tr>
											<td>Color axis type</td>
											<td>
												<select type="text" id="zi_type">
													<option value="value">value</option>
													<option value="category">category</option>
												</select>
											</td>
										</tr>
										<tr id="zi_value_slide">
											<td>Color axis threshold</td>
											<td>
												<label for=cutoff>Threshold</label>
												<input id="zi_value_cutoff" type=range min=0 max=1 value=0.01 step=0.001 id=cutoff>
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
											<td></td>
											<td>
												<label>Selected Columns</label>
												<select id="selected_cols" size="8" multiple="multiple" tabindex="1"></select>
											</td>
										</tr>
										</tbody>
									</table>
									<h3>QUERY GENES</h3>
									<textarea id="mytextarea" rows="10" cols="37"></textarea>
									<input id="highlight_gene" type="button" value="submit"/>
									<input id="reset_gene" type="button" value="reset"/>
									<div id="sconsole">
										<h2 id="gene_source">SOURCE</h2>
									<div id="console"></div>
									</div>
										<div id="console2">
											
										</div>
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
										<div id="canvas"></div>
										<div id="table">
											<h2>Table</h2>
											<table id="output_table"></table>
										</div>
									</div><!-- /.box-body -->

									<div class="box-footer"></div>
								</form>
								</div>