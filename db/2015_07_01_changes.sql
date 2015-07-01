UPDATE `biocore`.`sidebar` SET `link`='stat/status' WHERE `id`='12';

ALTER TABLE `biocore`.`ngs_samples` 
ADD COLUMN `target_id` INT NULL DEFAULT NULL AFTER `notebook_ref`;

CREATE TABLE `biocore`.`ngs_antibody_target` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `target` VARCHAR(100) NULL DEFAULT NULL,
  `target_symbol` VARCHAR(45) NULL DEFAULT NULL,
  `source` VARCHAR(45) NULL DEFAULT NULL,
  `product_id` VARCHAR(45) NULL DEFAULT NULL,
  `lot_id` VARCHAR(45) NULL DEFAULT NULL,
  `host_organism` VARCHAR(45) NULL DEFAULT NULL,
  `clonality` VARCHAR(45) NULL DEFAULT NULL,
  `isotype` VARCHAR(45) NULL DEFAULT NULL,
  `purifications` VARCHAR(45) NULL DEFAULT NULL,
  `url` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`));
