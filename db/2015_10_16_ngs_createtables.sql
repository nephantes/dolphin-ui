CREATE TABLE `biocore`.`ngs_createdtables` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NULL DEFAULT NULL,
  `parameters` VARCHAR(255) NULL DEFAULT NULL,
  `file` VARCHAR(100) NULL DEFAULT NULL,
  `owner_id` INT(11) NULL DEFAULT NULL,
  `group_id` INT(11) NULL DEFAULT NULL,
  `perms` INT(11) NULL DEFAULT NULL,
  `date_created` DATETIME NULL DEFAULT NULL,
  `date_modified` DATETIME NULL DEFAULT NULL,
  `last_modified_user` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`));