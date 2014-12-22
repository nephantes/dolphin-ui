<?php
class dbfuncs {
   
   function runSQL($sql)
   {
        $link = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
        // check connection
        if (mysqli_connect_errno()) {
                exit('Connect failed: '. mysqli_connect_error());
        }
        $result=$link->query($sql);
        $link->close();
        if ($result)
        {
            return $result;
        }
        return 0;
   }
    
   function queryTable($sql)
   {
     $data = array();
     if ($res = $this->runSQL($sql))
     {
        while(($row=$res->fetch_assoc())){$data[]=$row;}
        $res->close();
     }
     return json_encode($data);
   }
   
   function queryTableArr($sql)
   {
     return json_decode($this->queryTable($sql));
   }
   
   function queryAVal($sql)
   {
     $res = $this->runSQL($sql);
     $num_rows =$res->num_rows;

     if (is_object($res) && $num_rows>0)
     {
        $row=$res->fetch_array();
        return $row[0];
     }
     return "0";
   }
   
   function getTotalGalaxyRuns()
   {
     
     $sql="SELECT count(id) totalGalaxyRuns FROM biocore.galaxy_run;";
    
     return $this->queryAVal($sql);
   }
   
   function getTotalDolphinRuns()
   {
     
     $sql="SELECT count(id) totalGalaxyRuns FROM biocore.galaxy_run where dolphin=true;";
     return $this->queryAVal($sql);
   }
   function getTotalUsers()
   {
     
     $sql="SELECT count(id) totalUsers FROM biocore.users;";
     return $this->queryAVal($sql);
   }
   function getTotalJobs()
   {
     
     $sql="SELECT count(job_id) totaljobs FROM biocore.jobs;";
     return $this->queryAVal($sql);
   }
   function getName($username)
   {
     
     $sql="SELECT name FROM biocore.users  where username='$username';";
     return $this->queryAVal($sql);
   }
   function getRole($username)
   {
     
     $sql="SELECT role FROM biocore.users  where username='$username';";
     return $this->queryAVal($sql);
   }
   function getParentSideBar()
   { 
     $sql="SELECT name, link, iconname, treeview from biocore.sidebar where parent_name=''";
     return $this->queryTableArr($sql); 
   }
   function getSubMenuFromSideBar($parent)
   {
      $sql="SELECT name, link from biocore.sidebar where parent_name='$parent'";
      return $this->queryTableArr($sql); 
   }
   function getSubMenuFromDataTables($parent)
   {
      $sql="SELECT name, CONCAT('tables/index/', tablename) as link from biocore.datatables where parent_name='$parent'";
      return $this->queryTableArr($sql); 
   }
   
}

?>
