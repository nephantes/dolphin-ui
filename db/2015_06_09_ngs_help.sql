CREATE TABLE `biocore`.`ngs_help` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `field_name` VARCHAR(45) NULL,
  `video_url` VARCHAR(255) NULL,
  `help_text` VARCHAR(5000) NULL,
  PRIMARY KEY (`id`));
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('1', 'experiment_series', 'THIS IS HELP TEXT');

