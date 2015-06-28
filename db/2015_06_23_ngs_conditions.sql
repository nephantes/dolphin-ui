CREATE TABLE `biocore`.`ngs_sample_conds` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sample_id` INT NULL DEFAULT NULL,
  `cond_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `biocore`.`ngs_conds` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cond_symbol` VARCHAR(45) NULL DEFAULT NULL,
  `condition` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `biocore`.`ngs_samples` 
DROP COLUMN `condition_symbol`,
DROP COLUMN `condition`;

CREATE TABLE `biocore`.`ngs_source` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `source` VARCHAR(45) NULL DEFAULT NULL,
  `source_symbol` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `biocore`.`ngs_sample_source` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sample_id` INT NULL DEFAULT NULL,
  `source_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `biocore`.`ngs_samples` 
DROP COLUMN `source`,
DROP COLUMN `source_symbol`;

CREATE TABLE `biocore`.`ngs_organism` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `organism` VARCHAR(100) NULL DEFAULT NULL,
  `organism_symbol` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `biocore`.`ngs_sample_organism` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sample_id` INT NULL DEFAULT NULL,
  `organism_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `biocore`.`ngs_samples` 
DROP COLUMN `organism`;

CREATE TABLE `biocore`.`ngs_genotype` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `genotype` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `biocore`.`ngs_sample_genotype` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sample_id` INT NULL DEFAULT NULL,
  `genotype_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `biocore`.`ngs_samples` 
DROP COLUMN `genotype`;

CREATE TABLE `biocore`.`ngs_molecule` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `molecule` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `biocore`.`ngs_sample_molecule` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sample_id` INT NULL DEFAULT NULL,
  `molecule_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `biocore`.`ngs_samples` 
DROP COLUMN `molecule`;

CREATE TABLE `biocore`.`ngs_library_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `library_type` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `biocore`.`ngs_sample_library_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sample_id` INT NULL DEFAULT NULL,
  `library_type_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `biocore`.`ngs_samples` 
DROP COLUMN `library_type`;

CREATE TABLE `biocore`.`ngs_donor` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `donor` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `biocore`.`ngs_sample_donor` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sample_id` INT NULL DEFAULT NULL,
  `donor_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `biocore`.`ngs_samples` 
DROP COLUMN `donor`;

CREATE TABLE `biocore`.`ngs_biosample_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `biosample_type` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `biocore`.`ngs_sample_biosample_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sample_id` INT NULL DEFAULT NULL,
  `biosample_type_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `biocore`.`ngs_samples` 
DROP COLUMN `biosample_type`;

CREATE TABLE `biocore`.`ngs_instrument_model` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `instrument_model` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `biocore`.`ngs_sample_instrument_model` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sample_id` INT NULL DEFAULT NULL,
  `instrument_model_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `biocore`.`ngs_samples` 
DROP COLUMN `instrument_model`;

CREATE TABLE `biocore`.`ngs_treatment_manufacturer` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `treatment_manufacturer` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `biocore`.`ngs_sample_treatment_manufacturer` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sample_id` INT NULL DEFAULT NULL,
  `treatment_manufacturer_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `biocore`.`ngs_samples` 
DROP COLUMN `treatment_manufacturer`;

CREATE TABLE `biocore`.`ngs_library_strategy` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `library_strategy` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `biocore`.`ngs_samples` 
ADD COLUMN `source_id` INT NULL DEFAULT NULL AFTER `spike_ins`,
ADD COLUMN `organism_id` INT NULL DEFAULT NULL AFTER `source_id`,
ADD COLUMN `biosample_type_id` INT NULL DEFAULT NULL AFTER `organism_id`,
ADD COLUMN `instrument_model_id` INT NULL DEFAULT NULL AFTER `biosample_type_id`,
ADD COLUMN `genotype_id` INT NULL DEFAULT NULL AFTER `instrument_model_id`,
ADD COLUMN `library_type_id` INT NULL DEFAULT NULL AFTER `genotype_id`,
ADD COLUMN `molecule_id` INT NULL DEFAULT NULL AFTER `library_type_id`,
ADD COLUMN `treatment_manufacturer_id` INT NULL DEFAULT NULL AFTER `molecule_id`,
ADD COLUMN `donor_id` INT NULL DEFAULT NULL AFTER `treatment_manufacturer_id`,
ADD COLUMN `conditions_id` INT NULL DEFAULT NULL AFTER `donor_id`;

DROP TABLE `biocore`.`ngs_sample_biosample_type`, `biocore`.`ngs_sample_conds`, `biocore`.`ngs_sample_donor`, `biocore`.`ngs_sample_genotype`, `biocore`.`ngs_sample_instrument_model`, `biocore`.`ngs_sample_library_type`, `biocore`.`ngs_sample_molecule`, `biocore`.`ngs_sample_organism`, `biocore`.`ngs_sample_treatment_manufacturer`,`biocore`.`ngs_sample_source`;

