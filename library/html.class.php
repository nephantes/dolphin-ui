<?php

class HTML {
	private $js = array();

	function shortenUrls($data) {
		$data = preg_replace_callback('@(https?://([-\w\.]+)+(:\d+)?(/([\w/_\.]*(\?\S+)?)?)?)@', array(get_class($this), '_fetchTinyUrl'), $data);
		return $data;
	}

	private function _fetchTinyUrl($url) { 
		$ch = curl_init(); 
		$timeout = 5; 
		curl_setopt($ch,CURLOPT_URL,'http://tinyurl.com/api-create.php?url='.$url[0]); 
		curl_setopt($ch,CURLOPT_RETURNTRANSFER,1); 
		curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,$timeout); 
		$data = curl_exec($ch); 
		curl_close($ch); 
		return '<a href="'.$data.'" target = "_blank" >'.$data.'</a>'; 
	}

	function sanitize($data) {
		return mysql_real_escape_string($data);
	}

	function link($text,$path,$prompt = null,$confirmMessage = "Are you sure?") {
		$path = str_replace(' ','-',$path);
		if ($prompt) {
			$data = '<a href="javascript:void(0);" onclick="javascript:jumpTo(\''.BASE_PATH.'/'.$path.'\',\''.$confirmMessage.'\')">'.$text.'</a>';
		} else {
			$data = '<a href="'.BASE_PATH.'/'.$path.'">'.$text.'</a>';	
		}
		return $data;
	}

	function includeJs($fileName) {
		$data = '<script src="'.BASE_PATH.'/js/'.$fileName.'.js"></script>';
		return $data;
	}

	function includeCss($fileName) {
		$data = '<style href="'.BASE_PATH.'/css/'.$fileName.'.css"></script>';
		return $data;
	}

   function getContentHeader($name, $parent_name, $parent_link)
   {
	$html='	<!-- Content Header (Page header) -->
                <section class="content-header">
                    <h1>
                        '.$name.'
                        <small>'.$parent_name.'</small>
                    </h1>
                    <ol class="breadcrumb">
                        <li><a href="'.BASE_PATH.'"><i class="fa fa-dashboard"></i> Home</a></li>
                        <li><a href="'.BASE_PATH.'/'.$parent_link.'">'.$parent_name.'</a></li>
                        <li class="active">'.$name.'</li>
                    </ol>
                </section>';
	return $html;
   }
   
   function getDataTableFooterContent($fields, $table)
   {
     $html='</aside><!-- /.right-side -->
        </div><!-- ./wrapper -->


        <script type="text/javascript" language="javascript" src="//code.jquery.com/jquery-1.11.1.min.js"></script> 
        <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js" type="text/javascript"></script>
	<script src="//code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
        <script src="'.BASE_PATH.'/js/dataTables/jquery.dataTables.min.js"></script>
        <script src="'.BASE_PATH.'/js/dataTables/dataTables.bootstrap.js"></script>
        <script src="'.BASE_PATH.'/js/dataTables/dataTables.tableTools.min.js"></script>
        
        <!-- AdminLTE App -->
        <script src="'.BASE_PATH.'/js/AdminLTE/app.js" type="text/javascript"></script>

        <script type="text/javascript" language="javascript" src="'.BASE_PATH.'/js/dataTables/dataTables.editor.js"></script>
        <script type="text/javascript" language="javascript" src="'.BASE_PATH.'/js/dataTables/resources/syntax/shCore.js"></script>
        <script type="text/javascript" language="javascript" class="init">

	var editor; // use a global for the submit and return data rendering in the examples
	
	function toggleTable() {
	    var lTable = document.getElementById("descTable");
	    lTable.style.display = (lTable.style.display == "table") ? "none" : "table";
	}
	
	$(document).ready(function() {
		editor = new $.fn.dataTable.Editor( {
			"ajax": "/dolphin/public/php/ajax/ajax.php?t='.$table[0]['tablename'].'",
			"display": "lightbox",
			"table": "#'.$table[0]['tablename'].'",
			"fields": [';
	$usetablename = ($table[0]['joined']) ? $table[0]['tablename'].'.' : '';
			foreach ($fields as $field):
			$html.='{
				"label": "'.$field['title'].':",
				"name": "'.$usetablename.$field['fieldname'].'",
				';
			$html.=($field['options']!='' ) ? $field['options']:'';
			$html.=($field['joinedtablename']!="")? '"type": "select"':"";
			$html.=($field['len']>128)? '"type": "textarea"':"";
			$html.='},';
			endforeach;
	$html.=']
		} );
	
		$("#'.$table[0]['tablename'].'").DataTable( {
			dom: "Tfrtip",
			ajax: "/dolphin/public/php/ajax/ajax.php?t='.$table[0]['tablename'].'",
			columns: [';
			foreach ($fields as $field):
			$datafield=($field['joinedtablename']!="")? $field['joinedtablename'].'.'.$field['joinedtargetfield']:$usetablename.$field['fieldname'];
			
			$render = ( $field['render']!='' ) ? ",".$field['render']:'';
			$html.='	{ data: "'.$datafield.'"'.$render.' },
			';
			endforeach;
	$html.='],
			tableTools: {
				sRowSelect: "os",
				aButtons: [
					{ sExtends: "editor_create", editor: editor },
					{ sExtends: "editor_edit",   editor: editor },
					{ sExtends: "editor_remove", editor: editor }
				]
			},
			';
			if ($table[0]['joined']=='1'){
			$html.='initComplete: function ( settings, json ) {
			';
				foreach ($fields as $field):
				    if ($field['joinedtablename']!="") {
					$html.='editor.field( "'.$table[0]['tablename'].'.'.$field['fieldname'].'" ).update( json.'.$field['joinedtablename'].' );
					';
				    }
				endforeach;
			
			$html.='}';
			}
	$html.='	} );';
			
	$html.='} );
	
		</script>
	   </body>
	</html>
	';
	return $html;
   }
   
   function getSideMenuItem($obj )
   {
	$html="";
	foreach ($obj as $item):
	    $html.='<li><a href="'.BASE_PATH.'/'.$item->{'link'}.'"><i class="fa fa-angle-double-right"></i>'.$item->{'name'}.'</a></li>';
	endforeach;
	return $html;
   }
   
   function getDataTableContent($fields, $tablename)
   {
	$html='	<div class="container">
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
                                <tbody>';
	foreach ($fields as $field):
		$html.="<tr><th>".$field['title']."</th><td>".$field['summary']."</td></tr>";
	endforeach;
	$html.='			</table>
				</p>
                        </div>

                        <table id="'.$tablename.'" class="display" cellspacing="0" width="100%">
                                <thead>
                                        <tr>';
	foreach ($fields as $field):

                $html.="<th>".$field['title']."</th>";
	endforeach;
         $html.='                               </tr>
                                </thead>
                        </table>
			
                    </div><!-- /.row -->
                </section><!-- /.content -->
		</div>';
	return $html;
   }
   
 function getRespBoxTable_ng($title, $table, $fields)
   {
      $html='		       <div class="box">
                <div class="box-header">
                   <h3 class="box-title">'.$title.'</h3>
                </div><!-- /.box-header -->
                <div class="box-body table-responsive">
                  <table id="jsontable_'.$table.'" class="table table-hover table-striped table-condensed table-scrollable">
		  <thead>
                    <tr>
			'.$fields.'
                    </tr>
                   </thead>
                  </table>
                </div><!-- /.box-body -->
              </div><!-- /.box -->
			    
			   
      ';
      return $html;
   }

   
   function getBoxTable_ng($title, $table, $fields)
   {
      $html='		       <style>
				 
				 .table {margin:0 auto; border-collapse:separate;}
				 .table thead {}
				 
				 .table tbody {height:300px;overflow-y:scroll;}
  
				</style>
			
                              <div class="box">
                                <div class="box-header">
                                   <h3 class="box-title">'.$title.' Table</h3>
                                   <div class="pull-right box-tools">
                                      <button class="btn btn-primary btn-sm pull-right" data-widget="collapse" data-toggle="tooltip" title="Col
lapse" style="margin-right: 5px;"><i class="fa fa-minus"></i></button>
                                      <button class="btn btn-primary btn-sm daterange_'.$table.' pull-right" data-toggle="tooltip" title="Date 
range"><i class="fa fa-calendar"></i></button>
                                   </div><!-- /. tools -->
                               </div><!-- /.box-header -->
                               <div class="box-body table-responsive">
                                <table id="jsontable_'.$table.'" class="table table-bordered table-striped table-condensed table-scrollable" cellspacing="0" width="100%">
                                   <thead>
                                      <tr>
                                          '.$fields.'
                                      </tr>
                                  </thead>

                                 </table>
                            </div><!-- /.box-body -->
                            </div><!-- /.box -->
			    
			   
      ';
      return $html;
   }


   function getBoxTable_stat($userlab, $galaxydolphin, $fields)
   {
      $html='
                              <div class="box">
                                <div class="box-header">
                                   <h3 class="box-title">'.$galaxydolphin.' '.$userlab.' Table</h3>
                                   <div class="pull-right box-tools">
                                      <button class="btn btn-primary btn-sm pull-right" data-widget="collapse" data-toggle="tooltip" title="Col
lapse" style="margin-right: 5px;"><i class="fa fa-minus"></i></button>
                                      <button class="btn btn-primary btn-sm daterange_'.$userlab.' pull-right" data-toggle="tooltip" title="Dat
e range"><i class="fa fa-calendar"></i></button>
                                   </div><!-- /. tools -->
                               </div><!-- /.box-header -->
                               <div class="box-body table-responsive">
                                <table id="jsontable_'.$userlab.'" class="table table-bordered table-striped" cellspacing="0" width="100%">
                                   <thead>
                                      <tr>
                                          '.$fields.'
                                      </tr>
                                  </thead>
                                  <tfoot>
                                     <tr>
                                          '.$fields.'
                                     </tr>
                                 </tfoot>
                                 </table>
                            </div><!-- /.box-body -->
                            </div><!-- /.box -->
      ';
      return $html;
   }
   function getAccordion($name, $object)
   {
	 $html='      <div class="panel box box-primary">
                      <div class="box-header with-border">
                        <h4 class="box-title">
                          <a data-toggle="collapse" data-parent="#accordion" href="#collapse'.$name.'">
                            '.$name.'
                          </a>
                        </h4>
                      </div>
                      <div id="collapse'.$name.'" class="panel-collapse collapse in">
                        <div class="box-body">
			    <ul>
			    ';
			    foreach ($object as $obj):
				$html.='<li><a href="/dolphin/search/browse/'.$name."/".$obj['name'].'">'.$obj['name'].' ('.$obj['count'].')</a></li>';
			    endforeach;
	$html.='
			    </ul>
			</div>
                      </div>
		      </div>
	  ';
	  return $html;
   }
   
   function getExperimentSeriesPanel($objects)
   {
	foreach ($objects as $obj):
	$html='<div class="panel panel-default">
		<div class="panel-heading">
		<h4 class="panel-title">Experiment Series</h3>
		</div>
		<div class="panel-body">
		<h4>
		    '.$obj['experiment_name'].'
		</h4>
		</div>
		<div class="box-body">
		<dl class="dl-horizontal">
		<dt>Summary</dt>
		<dd>'.$obj['summary'].'</dd>
		<dt>Design</dt>
		<dd>'.$obj['design'].'</dd>
		</dl>
		</div> 
		</div>';
	endforeach;
	return $html;
   }
   function getBrowserPanel($objects, $fields, $header ,$name)
   {
	foreach ($objects as $obj):
	$html='<div class="panel panel-default">
		<div class="panel-heading">
		<h4 class="panel-title">'.$header.'</h3>
		</div>
		<div class="panel-body">
		<h4>
		    '.$obj[$name].'
		</h4>
		</div>
		<div class="box-body">
		<dl class="dl-horizontal">
		';
		foreach ($fields as $field):
		  if ($field['fieldname']!=$name && $obj[$field['fieldname']]!=""){
      	             $html.='   <dt>'.$field['title'].'</dt>';
		     $html.='  <dd>'.$obj[$field['fieldname']].'</dd>';
		  }
		endforeach;
	
	$html.=	'</dl>
		</div> 
		</div>';
	endforeach;
	return $html;
   }
   
   function getQCPanel()
   {
	$html='
	<div class="panel panel-default">
		<div class="panel-heading">
		  <h4>Analysis Results <small>Comprehensive Analysis</small></h4>
		</div>
		<div class="panel-body">
	 <iframe src="http://localhost/dolphin/bs.html" seamless frameborder=0 onload="this.width=855;this.height=600;"></iframe>
	</div>
	</div>
    ';
    return $html;
   }
   
   function getMultipleSelectBox($options, $id, $field, $idfield)
   {
	$html='<select class="form-control" id="'.$id.'" name="'.$id.'">';
	foreach ($options as $option):
                $html.="<option value='".$option[$idfield]."'>".$option[$field]."</option>";
	endforeach;
	$html.='</select>';
	return $html;
   }
   function getRadioBox($options, $id, $field)
   {
	$html='';
	foreach ($options as $option):
	        $html.='<div class="radio"><label>';
                $html.='<input type="radio" name="'.$id.'" id="'.$option['name'].'" value="'.$option['value'].'" '.$option['selected'].'>&nbsp;'.$option['name'];
		$html.='</label></div>';
	endforeach;
	return $html;
   }
   
   function sendJScript($jsData){
	$html="";
	if (!empty($jsData)) {
		$html.="<script type='text/javascript'>\n";
		$html.="var phpGrab = " . $jsData . "\n";
		$html.="</script>\n";
	}
	return $html;
   }
}
