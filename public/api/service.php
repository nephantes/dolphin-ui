<?php
require_once("funcs.php");

class Pipeline{
         public $params = null;
         /**
         * Use the query (often the requested URL) to define some settings.
         */
         public function parse_params( $params = null ) {
            // If a query has been passed to the function, turn it into an array.
            if ( is_string( $params) ) {
              $params = $this->parse_args( $params );
            }

            // If a query has not been passed to this function, just use the array of variables that
            // were passed in the URL.
            if (is_null($params)) {
              if(($_POST)){
               $this->params = $_POST;
              }
              else if(($_GET)){
               $this->params = $_GET;
              }

            }

            return get_object_vars( $this );
         }
        /**
         * getINI
         *
	 * @return string Response is a new random key if it is a new run otherwise old key.
	 */
	public function getINI(){
		$myClass = new funcs(); 
                
 		$ini = $myClass->getINI();
                return $ini;
         }

        /**
         * getKey
         *
	 * @return string Response is a new random key if it is a new run otherwise old key.
	 */
	public function getKey(){
		$myClass = new funcs(); 
                
 		$wkey = $myClass->getKey();
                return $wkey;
         }

	/**
	 * startWorkflow..
	 *
	 * @return string Response is a new random key if it is a new run otherwise old key.
	 */
	public function startWorkflow( $params ){
		$myClass = new funcs(); 
                
                $status = "exist";
                $wkey=$params['wkey']; 
                if($wkey=='' || $wkey=='start')
                {
 		   $wkey = $myClass->getKey();
                   $status = "new";
                }
		$ret=$myClass->startWorkflow($params['inputparam'], $params['defaultparam'], 
				             $params['username'], $params['workflow'], $wkey, $status, 
                                             $params['outdir'], $params['services']);
                if(eregi("^ERROR", $ret))
                {
                    return $ret;
                }
		return $wkey;
	}
 
	/**
	 * Run a service in the galaxy machine or cluster
	 * 
	 * @return string Response
	 */
	public function startService( $params){
		$myClass = new funcs();
		#Check if the job is started
                #return $params['servicename'].", ".$params['wkey'];
		$result = $myClass->checkStatus($params['servicename'], $params['wkey']); 
		if ( $result == "START") # Job hasn't started yet 
		{
		     $result=$myClass->startService($params['servicename'], $params['wkey'], $params['command']);
		     #$result = 0;
		}
		return $result;
	}
        
        /**
	 * endWorkflow
	 * 
	 * @param string $wkey a key for the run
	 * @return string Response 
	*/
	public function endWorkflow($params){
		$myClass = new funcs();
		#Check if the workflow ended 
		$result = $myClass->endWorkflow($params['wkey']); 
                
		return $result;
	}
	
	/**
        * Insert a job to database
        * 
        * @return string Response
        */
        public function insertJob($params){

               $myClass = new funcs();
               $res = $myClass->insertJob($params['username'], $params['wkey'] , $params['com'] , $params['jobname'], 
                                          $params['servicename'] , $params['jobnum'], $params['result']);
               if ($res!="True")
               {
                    return "ERROR 150: There is an error to insert for job=$jobname, jobnumber=$jobnum"; 
               }

               return $res;
        }

        /**
         * update a job in database
         * 
         * @return string Response
         */
         public function updateJob($params){
               $myClass = new funcs();
               $res = $myClass->updateJob($params['username'], $params['wkey'], $params['jobname'], 
                                          $params['servicename'] , $params['field'], $params['jobnum'], $params['result']);
               #if ($res!="True")
               #{
               #     return "ERROR 151: There is an error to update $field for $jobnum"; 
               #}

               return $res;
         }

        /**
         *  Check if all the jobs are finished for a service
         * 
         * @return string Response
         */
         public function checkAllJobsFinished($params){
                $myClass = new funcs();
                $res = $myClass->checkAllJobsFinished($params['username'], $params['wkey'] , $params['servicename']);
                #if ($res!="True")
                #{
                #    return "ERROR 152: There is an error in the service $servicename!"; 
                #}

                return $res;
         }
        /**
         * Insert a job output to db
         * 
         * @return string Response
         */
         function insertJobOut($params)
         {
                $myClass = new funcs();
                $res = $myClass->insertJobOut($params['username'], $params['wkey'], $params['jobnum'], $params['jobout']);
                if ($res!="True")
                {
                    return "ERROR 153: There is an error in the service $servicename!"; 
                }

                return $res;
         }
         /**
         * Insert a job stats to db
         * 
         * @return string Response
         */
         public function insertJobStats($params)
         {

                $myClass = new funcs();
                $res = $myClass->insertJobStats($params['username'], $params['wkey'] , $params['jobnum'], $params['stats']);
                if ($res!="True")
                {
                    return "ERROR 154: There is an error in the stats for job# $jobnum!";
                }

                return $res;
         }

         /** get job numbers for a given wkey
         * 
         * @return string Response
         */
         public function getJobNums($params)
         {
                $myClass = new funcs();
                $res = $myClass->getJobNums($params['wkey']);
                return $res;
         }

}

error_reporting(E_ALL);
ini_set('report_errors','on');

$myClass = new Pipeline();
#$result=$myClass->getINI();
#$data=json_encode($result);


$result=$myClass->parse_params();
$func=$result['params']['func'];
if ($func)
{
  $result=$myClass->$func($result['params']);
  $data=json_encode($result);
}

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo $data;
exit;


