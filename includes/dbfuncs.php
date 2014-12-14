<?php
class dbfuncs {
   function test()
   {
      return "[HERE]";
   }
   
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
   
   function makeBox($sql, $title)
   {
    
    $columns = array();
    $data = array();
    
    $html='<div class="box">
        <div class="box-header">
            <h3 class="box-title">'.$title.'</h3>
            <div class="pull-right box-tools">
                 <button class="btn btn-primary btn-sm pull-right" data-widget="collapse" data-toggle="tooltip" title="Collapse" style="margin-right: 5px;"><i class="fa fa-minus"></i></button>
            </div><!-- /. tools -->
        </div><!-- /.box-header -->
        <div class="box-body no-padding">
            <table id="top20galaxyusers" class="table table-striped">';  
    if ($res = $this->runSQL($sql))
    {
      $i=0; 
      while ($row = $res->fetch_assoc()) {
        if ($i==0)
        {
         $columns = array_keys($row);
         $html.='<tr><th>'.implode('</th><th>', $columns).'</th></tr>';
        }
        $data=$row;
        $html.='<tr><td>'.implode('</td><td>', $data).'</td></tr>';
        $i++;
      }
      $res->close();
      
    }

     $html.='      </table>
        </div><!-- /.box-body -->
    </div><!-- /.box -->';
   
    return $html;
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
     
     $sql="SELECT count(userid) totalUsers FROM biocore.users;";
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
   
   function getTopUsers($type)
   {
     if ($type=="Dolphin"){$dolphin="and dolphin=true";}
     $title="Top 10 $type Users";
     $sql = "select u.name, u.lab, count(g.id) count
            from biocore.galaxy_run g, biocore.users u
            where u.username=g.username $dolphin
            group by g.username
            order by count desc
            limit 10";

     return $this->makeBox($sql, $title);
   }
   function getTopUsersLastMonth($type)
   {
     if ($type=="Dolphin"){$dolphin="and dolphin=true";}
     $title="Top 10 $type Users (Last 30 days)";
     $sql = "select u.name, u.lab, count(g.id) count
            from biocore.galaxy_run g, biocore.users u
            where u.username=g.username and
            g.start_time>= ADDDATE(now(),-30) $dolphin
            group by g.username 
            order by count desc
            limit 10";

     return $this->makeBox($sql, $title);
   }
   function getTopLabs($type)
   {
     if ($type=="Dolphin"){$dolphin="and dolphin=true";}
     $title="Top 10 $type Labs";
     $sql = "select u.lab, count(g.id) count
            from biocore.galaxy_run g, biocore.users u
            where u.username=g.username $dolphin
            group by u.lab
            order by count desc
            limit 10";

     return $this->makeBox($sql, $title);
   }
   function getTopLabsLastMonth($type)
   {
     if ($type=="Dolphin"){$dolphin="and dolphin=true";}
     $title="Top 10 $type Labs (Last 30 days)";
     $sql = "select u.lab, count(g.id) count
            from biocore.galaxy_run g, biocore.users u
            where u.username=g.username and
            g.start_time >= ADDDATE(now(),-30) $dolphin
            group by u.lab
            order by count desc
            limit 10";

     return $this->makeBox($sql, $title);
   }
   function getTopTools($type)
   {
     if ($type=="Dolphin"){$dolphin="and dolphin=true";}
     $title="Top $type Tools";
     $sql = "select g.tool_name, count(g.id) count
            from biocore.galaxy_run g, biocore.users u
            where u.username=g.username $dolphin
            group by g.tool_name
            order by count desc
            limit 20";

     return $this->makeBox($sql, $title);
   }
   function getTopToolsLastMonth($type)
   {
     if ($type=="Dolphin"){$dolphin="and dolphin=true";}
     $title="Top $type Tools (Last 30 days)";
     $sql = "select g.tool_name, count(g.id) count
            from biocore.galaxy_run g, biocore.users u
            where u.username=g.username and
            g.start_time >= ADDDATE(now(),-30) $dolphin
            group by g.tool_name
            order by count desc
            limit 20";

     return $this->makeBox($sql, $title);
   }
   
}

?>
