<?php
 
class NgsimportController extends VanillaController {

    function beforeAction() {

    }
 
    function index() {
     
        $this->set('title','NGS Excel Import');
    }
    function process() {
            $filename=$_FILES["excelFile"]["tmp_name"];
            $text = "Files size: ".$_FILES["excelFile"]["size"]."</br>";

            if($_FILES["excelFile"]["size"] > 0 && $_FILES["excelFile"]["size"]<500000)
            {

               //$target_file='tmp/files/'.$_FILES["excelFile"]["tmp_name"].'.xlsx';
               $target_file='../tmp/files/a.xlsx';
               move_uploaded_file($_FILES["excelFile"]["tmp_name"], $target_file);
               /** Include path **/
               set_include_path('../includes/excel/Classes/');

               /** PHPExcel_IOFactory */
               include 'PHPExcel/IOFactory.php';
               require_once '../includes/dbfuncs.php';

               $inputFileType = 'Excel5';
               $inputFileName = $target_file;
               $text.='Loading excel file <br />';
               $objReader = PHPExcel_IOFactory::createReader($inputFileType);

               $text.='<hr />';

               $worksheetData = $objReader->listWorksheetInfo($inputFileName);
               $objPHPExcel = $objReader->load($inputFileName);

               $text.='<h3>Worksheet Information</h3>';
               $text.='<ol>';
               $ngs=new Ngsimport();
               foreach ($worksheetData as $worksheet) {
                    $objPHPExcel->setActiveSheetIndexByName($worksheet['worksheetName']);
                    $sheetData = $objPHPExcel->getActiveSheet()->toArray(null,true,true,true);
                    $text.=$ngs->parseExcel($_POST["inputDir"], $worksheet, $sheetData);
                }
                $text.='</ol>';

            }
            $this->set('mytext', $text);
    }

    function afterAction() {

    }

}
