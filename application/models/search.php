<?php

class Search extends VanillaModel {

/** Get menuitems for this user **/
	function getAccItems($fieldname, $tablename, $uid, $gids) {
        
        if($gids == ''){
            $gids = -1;
        }
		$result = $this->query("select $fieldname name, count($fieldname) count from $tablename where $fieldname !='' AND (((group_id in ($gids)) AND (perms >= 15)) OR (owner_id = $uid)) group by $fieldname");
		return json_decode($result, true);
	}
	function getAccItemsCont($fieldname, $tablename, $search, $uid, $gids){
        if($gids == ''){
            $gids = -1;
        }
		if($search != ""){
			$advQuery = "";
			foreach(explode('$', $search) as $s){
				$s = urldecode($s);
				$split = explode('=', $s);
				$advQuery.= " AND " . $split[0]. " = " . '"'. $split[1] . '"';
			}
			$result = $this->query("select $fieldname name, count($fieldname) count from $tablename where $fieldname !='' $advQuery AND (((group_id in ($gids)) AND (perms >= 15)) OR (owner_id = $uid)) group by $fieldname");
		}
		else{
			$result = $this->query("select $fieldname name, count($fieldname) count from $tablename where $fieldname !='' AND (((group_id in ($gids)) AND (perms >= 15)) OR (owner_id = $uid)) group by $fieldname" );
		}
		return json_decode($result, true);
	}
	function getId($value, $idfield, $table) {
		$result = $this->query("select DISTINCT $idfield from $table where `id`='$value'", 1);
		return $result;
	}
	function getValues($value, $table) {
		$result = $this->query("select * from $table where `id`='$value'");
		return json_decode($result, true);
	}
	function getFields($table){
		$result = $this->query("select df.fieldname, df.title from datatables dt, datafields df where df.table_id=dt.id and dt.tablename='$table'");
		return json_decode($result, true);
	}
    function getGroup($username) {
        $groups = json_decode($this->query("select g.id from user_group ug, users u, groups g where ug.u_id=u.id and ug.g_id=g.id and username='$username'"), true);
        $group_str='';
        foreach ($groups as $group):
            $group_str.=$group['id'].",";
        endforeach;
        return rtrim($group_str, ",");
    }
	
}
