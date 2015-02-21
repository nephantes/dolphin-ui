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
   
   function getTotalGalaxyRuns($username)
   {
     $userstr="";
     if ($username!="")
     {
       #For individual user
       #$userstr=" where username='$username'"; 
       #For the groups the user belong to
       $userstr=" where username in (select u.username from user_group ug, users u where u.id=ug.u_id and ug.g_id in ( SELECT ug.g_id from user_group ug, users u where u.id=ug.u_id and u.username='$username'))";
     }
     
     
     $sql="SELECT count(id) totalGalaxyRuns FROM biocore.galaxy_run $userstr;";
    
     return $this->queryAVal($sql);
   }
   
   function getTotalDolphinRuns($username)
   {
     $userstr="";
     if ($username!="")
     {
       #For individual user
       #$userstr=" and username='$username'"; 
       #For the groups the user belong to
       $userstr=" and username in (select u.username from user_group ug, users u where u.id=ug.u_id and ug.g_id in ( SELECT ug.g_id from user_group ug, users u where u.id=ug.u_id and u.username='$username'))";
     }
     $sql="SELECT count(id) totalGalaxyRuns FROM biocore.galaxy_run where dolphin=true $userstr;";
     return $this->queryAVal($sql);
   }
   function getTotalUsers()
   {
     
     $sql="SELECT count(id) totalUsers FROM biocore.users;";
     return $this->queryAVal($sql);
   }
   function getTotalJobs($username)
   {
     $userstr="";
     if ($username!="")
     {
       $userstr=" , biocore.users u where j.username=u.clusteruser and u.username='$username'"; 
     }
     $sql="SELECT count(j.job_id) totaljobs FROM biocore.jobs j $userstr;";
     return $this->queryAVal($sql);
   }
   function getTotalSamples($username)
   {
     #For individual user
     #$userstr=" and username='$username'"; 
     #For the groups the user belong to
     $userstr=" and username in (select u.username from user_group ug, users u where u.id=ug.u_id and ug.g_id in ( SELECT ug.g_id from user_group ug, users u where u.id=ug.u_id and u.username='$username'))";
     $sql="SELECT count(ng.id)  FROM biocore.ngs_samples ng, biocore.users u where u.id=ng.owner_id $userstr;";
     return $this->queryAVal($sql);
   }
   function getName($username)
   {
     
     $sql="SELECT name FROM biocore.users  where username='$username';";
     return $this->queryAVal($sql);
   }
   function getUserId($username)
   {
     
     $sql="SELECT id FROM biocore.users where username='$username';";
     return $this->queryAVal($sql);
   }
   
   function getRole($username)
   {
     
     $sql="SELECT role FROM biocore.users  where username='$username';";
     return $this->queryAVal($sql);
   }
   function getParentSideBar()
   {
     $sql= "SELECT DISTINCT name, link, iconname, treeview FROM
           (SELECT t.* FROM biocore.sidebar t where ((t.perms>32) OR t.owner_id=".$_SESSION['uid'].")
           UNION 
           SELECT t.* FROM biocore.sidebar t, biocore.user_group ug
           where t.group_id in (select g_id from user_group where u_id=".$_SESSION['uid'].") 
           and ug.group_id=t.group_id and t.perms>=15) s where s.parent_name=''";
     return $this->queryTableArr($sql); 
   }
   function getSubMenuFromSideBar($parent)
   {
      $sql="SELECT DISTINCT name, link from
           (SELECT t.* FROM biocore.sidebar t where ((t.perms>32) OR t.owner_id=".$_SESSION['uid'].")
           UNION 
           SELECT t.* FROM biocore.sidebar t, biocore.user_group ug
           where t.group_id in (select g_id from user_group where u_id=".$_SESSION['uid'].") 
           and ug.group_id=t.group_id and t.perms>=15) s
      where s.parent_name='$parent'";
      return $this->queryTableArr($sql); 
   }
   function getSubMenuFromDataTables($parent)
   {
      $sql="SELECT DISTINCT name, CONCAT('tables/index/', tablename) as link from
            (SELECT t.* FROM biocore.datatables t where ((t.perms>32) OR t.owner_id=".$_SESSION['uid'].")
           UNION 
           SELECT t.* FROM biocore.datatables t, biocore.user_group ug
           where t.group_id in (select g_id from user_group where u_id=".$_SESSION['uid'].") 
           and ug.group_id=t.group_id and t.perms>=15) s
      where s.parent_name='$parent'";
      
      return $this->queryTableArr($sql); 
   }
   
}

?>
