CREATE TABLE `biocore`.`ngs_help` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `field_name` VARCHAR(45) NULL,
  `video_url` VARCHAR(255) NULL,
  `help_text` VARCHAR(5000) NULL,
  PRIMARY KEY (`id`));
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('1', 'experiment_series', 'experiment series');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('2', 'lanes', 'lanes');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('3', 'samples', 'samples');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('4', 'run_name', 'run name');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('5', 'description', 'description');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('6', 'genomebuild', 'genomebuild');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('7', 'spaired', 'spaired');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('8', 'resume', 'resume');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('9', 'outdir', 'outdir');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('10', 'fastqc', 'fastqc');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('11', 'barcodes', 'barcodes');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('12', 'adapter', 'adapter');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('13', 'custom', 'custom');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('14', 'pipeline', 'pipeline');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('15', 'split', 'split');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('16', 'quality', 'quality');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('17', 'trim', 'trim');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('18', 'commonind', 'commonind');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('19', 'barcode_sep', 'barcode sep');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('20', 'Barcode Definitions', 'barcode defs');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('21', 'series_name', 'series name');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('22', 'lane_name', 'lane name');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('23', 'input_dir', 'input dir');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('24', 'input_files', 'input files');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('25', 'backup_dir', 'backup dir');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('26', 'amazon_bucket', 'amazon bucket');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('27', 'runparams', 'run parameters');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('28', 'services', 'services');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('29', 'jobs', 'jobs');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('30', 'initial_mapping', 'initial mapping');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('31', 'summary', 'summary');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('32', 'details', 'details');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('33', 'RSEM', 'RSEM');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('34', 'DESEQ', 'DESEQ');
INSERT INTO `biocore`.`ngs_help` (`id`, `field_name`, `help_text`) VALUES ('35', 'excel_import', 'excel import');

