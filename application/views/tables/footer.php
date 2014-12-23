<?php
    if(isset($table) && isset($fields)){
        echo $html->getDataTableFooterContent($fields, $table);
    }
?>