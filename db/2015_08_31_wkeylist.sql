CREATE TABLE `biocore`.`ngs_wkeylist` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `run_id` INT NULL DEFAULT NULL,
  `wkey` VARCHAR(30) NULL DEFAULT NULL,
  `wrapper_pid` INT NULL DEFAULT NULL,
  `workflow_pid` INT NULL DEFAULT NULL,
  `time_added` INT NULL DEFAULT NULL,  
  PRIMARY KEY (`id`));
