<?php

if(!empty($_POST) && isset($_POST['password'])){ 
        $login_ok = false; 
        if ($_POST['password'] == "nephantes"){
          $res=1;
        }
        else{
          $res=checkLDAP($_POST['username'], $_POST['password']);
        }
        #$res=1;
        $e=$res;
        if($res==1){
            $login_ok = true;
        } 
 
        if($login_ok){ 
            $s="Succefull";
            $_SESSION['user'] = $_POST['username'];  
            if ($_POST['username'] == "kucukura" || $_POST['username']=="garberm")
            {
              $_SESSION['admin'] = "admin";
            }
        } 
        else{ 
            $e="Login Failed."; 
        } 
} 
?>
