<?php

function checkLDAP($username, $password)
{
  $ldapserver = LDAP_SERVER;
  $dn_string = DN_STRING;
  $binduser = BIND_USER;
  $bindpass = BIND_PASS;
 
  $connection = ldap_connect($ldapserver);
  ldap_set_option($connection, LDAP_OPT_PROTOCOL_VERSION, 3);
  ldap_set_option($connection, LDAP_OPT_REFERRALS, 0);
 
  if($connection)
  {
     $bind = ldap_bind($connection, $binduser, $bindpass );
     if($bind)
     {
             $filter="sAMAccountName=".$username."*";
             $result = ldap_search($connection,$dn_string,$filter) or die ("Search error.");
             $data = ldap_get_entries($connection, $result);
             $binddn = $data[0]["dn"];
             if (!isset($binddn))
               return 0;
             $bind = ldap_bind($connection, $binddn, $password);
             if($bind) 
                return 1;
             else
                return 0;
      }
  }
}

?>
