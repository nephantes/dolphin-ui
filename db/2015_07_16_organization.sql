ALTER TABLE `biocore`.`ngs_experiment_series` 
ADD COLUMN `organization_id` INT(11) NULL DEFAULT NULL AFTER `lab_id`;

