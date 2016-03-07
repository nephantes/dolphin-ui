CREATE TABLE `biocore`.`ngs_deleted_runs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `run_id` INT NULL DEFAULT NULL,
  `outdir` VARCHAR(100) NULL DEFAULT NULL,
  `run_status` INT NULL DEFAULT NULL,
  `json_parameters` VARCHAR(1000) NULL DEFAULT NULL,
  `run_name` VARCHAR(100) NULL DEFAULT NULL,
  `run_description` VARCHAR(255) NULL DEFAULT NULL,
  `owner_id` INT NULL DEFAULT NULL,
  `group_id` INT NULL DEFAULT NULL,
  `perms` INT NULL DEFAULT NULL,
  `last_modified_user` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`));
