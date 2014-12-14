<?php

function checkLDAP($username, $password)
{
  $ldapserver = 'edunivad02.ad.umassmed.edu';
  $dn_string  = 'ou=Accounts,dc=ad,dc=umassmed,dc=edu';
  $binduser   = 'SVCLinuxLDAPAuth';
  $bindpass   = 'Umass2008';
 
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
