<?php
error_reporting(E_ERROR);
//error_reporting(E_ALL);
ini_set('report_errors','on');

require_once("../../config/config.php");
require_once("../../includes/dbfuncs.php");

$query = new dbfuncs();

if (isset($_GET['p'])){$p = $_GET['p'];}
if($p == "getFileList")
{
    $owner_sql = "";
    if (isset($_GET['owner'])){
       $owner_sql = " f.owner_id = ".$_GET['owner']." and ";
    }
    $data=$query->queryTable("
     SELECT d.fastq_dir, f.file_name, d.amazon_bucket, ac.aws_access_key_id ak, ac.aws_secret_access_key sk
     FROM ngs_fastq_files f, ngs_dirs d, group_amazon ga, amazon_credentials ac
     where d.id=f.dir_id and d.amazon_bucket!='' and
     d.amazon_bucket != 'none' and ga.group_id=d.group_id and ac.id=ga.amazon_id and $owner_sql
     (f.backup_checksum='' or isnull(f.backup_checksum) or DATE(f.date_modified) <= DATE(NOW() - INTERVAL 2 MONTH))
    ");
}
else if($p == "getFileListGeneric")
{
    $data=$query->queryTable("
   SELECT a.id, a.file_name, a.s3bucket, ac.aws_access_key_id ak, ac.aws_secret_access_key sk from amazon_backup a, amazon_credentials ac, group_amazon ga where a.group_id=ga.group_id and ac.id=ga.amazon_id AND (a.backup_checksum='' or isnull(a.backup_checksum) or DATE(a.date_modified) <= DATE(NOW() - INTERVAL 2 MONTH))
    ");
}
if($p == "updateHashBackupGeneric")
{
   if (isset($_GET['file_id'])){$file_id = rawurldecode($_GET['file_id']);}
   if (isset($_GET['hashstr'])){$hashstr = rawurldecode($_GET['hashstr']);}
   $sql="UPDATE amazon_backup 
   set backup_checksum='$hashstr',
   date_modified=NOW()
   where 
   id = '$file_id'";
   $data = $query->runSQL($sql);
}
else if($p == "getUnmatchedList")
{
    $data=$query->queryTable("
   SELECT id, file_name, s3bucket, checksum,  date_modified from amazon_backup where (backup_checksum!='' and !isnull(backup_checksum) and checksum != backup_checksum )
    ");
}
else if($p == "updateHashBackup")
{
   if (isset($_GET['input'])){$input = rawurldecode($_GET['input']);}
   if (isset($_GET['dirname'])){$dirname = rawurldecode($_GET['dirname']);}
   if (isset($_GET['hashstr'])){$hashstr = rawurldecode($_GET['hashstr']);}
   $data=$query->runSQL("
   UPDATE  ngs_fastq_files nff, 
   (SELECT nff.id FROM ngs_fastq_files nff, ngs_dirs nd
   where nff.dir_id = nd.id AND 
   nff.file_name='$input' AND 
   nd.fastq_dir='$dirname') a 
   set nff.backup_checksum='$hashstr',
   date_modified=NOW()
   where a.id=nff.id
   ");
}
else if ($p == "getSelectedFileList")
{
    if (isset($_GET['samples'])){$samples = rawurldecode($_GET['samples']);}
    $data=$query->queryTable("
    SELECT d.backup_dir, f.file_name
    FROM ngs_fastq_files f, ngs_dirs d 
    where d.id=f.dir_id and f.sample_id in ($samples)
    ");
}
else if ($p == "updateRecheckChecksum")
{
    if (isset($_GET['input'])){$input = rawurldecode($_GET['input']);}
    if (isset($_GET['dirname'])){$dirname = rawurldecode($_GET['dirname']);}
    if (isset($_GET['hashstr'])){$hashstr = rawurldecode($_GET['hashstr']);}
    $data=$query->queryTable("
    UPDATE  ngs_fastq_files nff, 
    (SELECT nff.id FROM ngs_fastq_files nff, ngs_dirs nd
    where nff.dir_id = nd.id AND 
    nff.file_name='$input' AND 
    nd.backup_dir='$dirname') a 
    set nff.checksum_recheck='$hashstr'
    where a.id=nff.id
    ");
    $data=$query->queryTable("
    SELECT nff.id FROM ngs_fastq_files nff, ngs_dirs nd
    where nff.dir_id = nd.id AND 
    nff.file_name='$input' AND 
    nd.backup_dir='$dirname'
    ");
}

if (!headers_sent()) {
   header('Cache-Control: no-cache, must-revalidate');
   header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
   header('Content-type: application/json');
   echo $data;
   exit;
}else{
   echo $data;
}
?>
