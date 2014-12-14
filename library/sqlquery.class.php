<?php

class SQLQuery {
    protected $_dbHandle;
    protected $_result;

    /** Connects to database **/

    function connect($dbhost, $dbuser, $dbpass, $db) {
        $this->_dbHandle = new mysqli($dbhost, $dbuser, $dbpass, $db);
        if (mysqli_connect_errno()) {
                exit('Connect failed: '. mysqli_connect_error());
        }
        return 1;
    }

    /** Disconnects from database **/

    function disconnect() {
        if ($this->_dbHandle->close() != 0) {
            return 1;
        }  else {
            return 0;
        }
    }
    
    function selectAll() {
        $query = 'select * from `'.$this->_table.'`';
        return $this->query($query);
    }
    
    function select($id) {
        $query = 'select * from `'.$this->_table.'` where `id` = \''.$id.'\'';
        return $this->query($query, 1);    
    }

    function runSQL($sql)
    {
        $result=$this->_dbHandle->query($sql);
        if ($result)
        {
            return $result;
        }
        return 0;
    }

        
    /** Custom SQL Query **/

    function query($query, $singleResult = 0) {

       $this->_result = $this->runSQL($query);
       //print $query;

       if (preg_match("/select/i",$query)) {

	 if (is_object($this->_result)) {
           $num_rows =$this->_result->num_rows;
           $result = array();
       
           if ($num_rows>0) {
              if ($singleResult == 1) {
                 $row=$this->_result->fetch_array();
                 return $row[0];
              } 
              else {
                 while(($row=$this->_result->fetch_assoc())){$result[]=$row;}
              }
           }	
           return json_encode($result);
         }
       }
    }

    /** Get number of rows **/
    function getNumRows() {
        return $this->_result->num_rows;
    }

    /** Free resources allocated by a query **/

    function freeResult() {
        $this->_result->free();
    }

    /** Get error string **/

    function getError() {
        return $this->_dbHandle->error;
    }

}
