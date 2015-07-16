ALTER TABLE `biocore`.`ngs_experiment_series` 
ADD COLUMN `organization_id` INT(11) NULL DEFAULT NULL AFTER `lab_id`;

ALTER TABLE `biocore`.`ngs_lab` 
DROP COLUMN `organization_id`;

