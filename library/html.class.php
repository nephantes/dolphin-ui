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


   function getBoxTable_ng($title, $table, $fields)
   {
      $html='		       <style>
				 
				 .table {margin:0 auto; border-collapse:separate;}
				 .table thead {display:block}
				 
				 .table tbody {height:300px;overflow-y:scroll;display:block}
  
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

}
