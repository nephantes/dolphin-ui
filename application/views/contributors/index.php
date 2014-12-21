<?php
	    
    echo $html->getContentHeader($table[0]['name'], $table[0]['parent_name'], $table[0]['parent_link']);
    echo $html->getDataTableContent($fields, $table[0]['tablename']);

?>


