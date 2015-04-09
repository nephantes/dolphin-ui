/*Alter database in order for pipeline to run effectively*/

ALTER TABLE `biocore`.`ngs_runlist` 
ADD COLUMN `run_id` INT(11) NULL AFTER `id`;