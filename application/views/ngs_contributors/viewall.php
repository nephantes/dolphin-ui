<form action="../contributors/add" method="post">
<input type="text" value="Name..." onclick="this.value=''" name="contributor"> <input type="submit" value="add">
</form>
<br/><br/>
<?php $number = 0?>
 
<?php foreach ($contributors as $contributor):?>
    <a class="big" href="../contributors/view/<?php echo $contributor['NGS_contributor']['id']?>/<?php echo strtolower(str_replace(" ","-",$contributor['NGS_contributor']['contributor']))?>">
    <span class="item">
    <?php echo ++$number?>
    <?php echo $contributor['NGS_contributor']['contributor']))?>
    </span>
    </a><br/>
<?php endforeach?>
