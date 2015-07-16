
ALTER TABLE `ngs_runparams` 
ADD COLUMN `wrapper_pid` INT NULL DEFAULT NULL AFTER `run_status`,
ADD COLUMN `runworkflow_pid` INT NULL DEFAULT NULL AFTER `wrapper_pid`;

