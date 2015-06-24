<?php

class Search extends VanillaModel {

    public $innerJoin = "LEFT JOIN ngs_sample_source
                ON ngs_samples.id = ngs_sample_source.sample_id
                LEFT JOIN ngs_source
                ON ngs_sample_source.source_id = ngs_source.id
                LEFT JOIN ngs_sample_organism
                ON ngs_samples.id = ngs_sample_organism.sample_id
                LEFT JOIN ngs_organism
                ON ngs_sample_organism.organism_id = ngs_organism.id
                LEFT JOIN ngs_sample_molecule
                ON ngs_samples.id = ngs_sample_molecule.sample_id
                LEFT JOIN ngs_molecule
                ON ngs_sample_molecule.molecule_id = ngs_molecule.id
                LEFT JOIN ngs_sample_genotype
                ON ngs_samples.id = ngs_sample_genotype.sample_id
                LEFT JOIN ngs_genotype
                ON ngs_sample_genotype.genotype_id = ngs_genotype.id
                LEFT JOIN ngs_sample_library_type
                ON ngs_samples.id = ngs_sample_library_type.sample_id
                LEFT JOIN ngs_library_type
                ON ngs_sample_library_type.library_type_id = ngs_library_type.id
                LEFT JOIN ngs_sample_conds
                ON ngs_samples.id = ngs_sample_conds.sample_id
                LEFT JOIN ngs_conds
                ON ngs_sample_conds.cond_id = ngs_conds.id";
                
/** Get menuitems for this user **/
	function getAccItems($fieldname, $tablename, $uid, $gids) {
        
        if($gids == ''){
            $gids = -1;
        }

        if($tablename == 'ngs_samples'){
            $result = $this->query("select $fieldname name, count($fieldname) count from $tablename where $fieldname !='' AND (((group_id in ($gids)) AND (perms >= 15)) OR (owner_id = $uid)) group by $fieldname");
        }else{
            $result = $this->query("select $fieldname name, count(ngs_samples.id) count
                                                FROM `ngs_samples`
                                                INNER JOIN ngs_sample_$fieldname
                                                ON ngs_samples.id = ngs_sample_$fieldname.sample_id
                                                INNER JOIN $tablename
                                                ON ngs_sample_$fieldname."."$fieldname"."_id = $tablename.id
                                                WHERE (((group_id in ($gids)) AND (perms >= 15)) OR (owner_id = $uid))
                                                GROUP BY $fieldname");
        }
		return json_decode($result, true);
	}
	function getAccItemsCont($fieldname, $tablename, $search, $uid, $gids){
        if($gids == ''){
            $gids = -1;
        }
		if($search != ""){
			$advQuery = "";
            $advJoin = "";
			foreach(explode('$', $search) as $s){
				$s = urldecode($s);
				$split = explode('=', $s);
                if($split[0] != $fieldname){
                    $advJoin.= "INNER JOIN ngs_sample_".$split[0]."
                                ON ngs_samples.id = ngs_sample_".$split[0].".sample_id
                                INNER JOIN ngs_".$split[0]."
                                ON ngs_sample_".$split[0].".".$split[0]."_id = ngs_".$split[0].".id ";
                }
				$advQuery.= " AND " . $split[0]. " = " . '"'. $split[1] . '"';
			}
			if($tablename == 'ngs_samples'){
                $result = $this->query("SELECT $fieldname name, count($fieldname) count FROM $tablename WHERE $fieldname !='' $advQuery AND (((group_id in ($gids)) AND (perms >= 15)) OR (owner_id = $uid)) group by $fieldname");
            }else{
                $result = $this->query("SELECT $fieldname name, count(ngs_samples.id) count
                                        FROM `ngs_samples`
                                        INNER JOIN ngs_sample_$fieldname
                                        ON ngs_samples.id = ngs_sample_$fieldname.sample_id
                                        INNER JOIN $tablename
                                        ON ngs_sample_$fieldname."."$fieldname"."_id = $tablename.id
                                        $advJoin
                                        WHERE (((group_id in ($gids)) AND (perms >= 15)) OR (owner_id = $uid))
                                        $advQuery
                                        GROUP BY $fieldname");
        }
		}else{
			if($tablename == 'ngs_samples'){
                $result = $this->query("SELECT $fieldname name, count($fieldname) count FROM $tablename WHERE $fieldname !='' AND (((group_id in ($gids)) AND (perms >= 15)) OR (owner_id = $uid)) group by $fieldname");
            }else{
                $result = $this->query("SELECT $fieldname name, count(ngs_samples.id) count
                                        FROM `ngs_samples`
                                        INNER JOIN ngs_sample_$fieldname
                                        ON ngs_samples.id = ngs_sample_$fieldname.sample_id
                                        INNER JOIN $tablename
                                        ON ngs_sample_$fieldname."."$fieldname"."_id = $tablename.id
                                        WHERE (((group_id in ($gids)) AND (perms >= 15)) OR (owner_id = $uid))
                                        GROUP BY $fieldname");
            }
		}
		return json_decode($result, true);
	}
	function getId($value, $idfield, $table) {
		$result = $this->query("select DISTINCT $idfield from $table where `id`='$value'", 1);
		return $result;
	}
	function getValues($value, $table) {
        if($table == 'ngs_samples'){
            $result = $this->query("select * from $table ".$this->innerJoin." where $table.`id`='$value'");
        }else{
            $result = $this->query("select * from $table where `id`='$value'");
        }
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
    function getSampleFileLocation($value){
        $result = $this->query("select file_name from ngs_fastq_files where sample_id = $value");
        if($result == null or $result == []){
            $result = $this->query("select file_name from ngs_temp_sample_files where sample_id = $value");
        }
		return json_decode($result, true);
    }
	function getLaneFileLocation($value){
        $result = $this->query("select file_name from ngs_temp_lane_files where lane_id = $value");
		return json_decode($result, true);
    }
}
