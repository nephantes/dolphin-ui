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

ALTER TABLE `biocore`.`ngs_samples` 
DROP COLUMN `source`,
DROP COLUMN `source_symbol`,
ADD COLUMN `source_id` INT NULL DEFAULT NULL AFTER `spike_ins`;

CREATE TABLE `biocore`.`ngs_organism` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `organism` VARCHAR(100) NULL DEFAULT NULL,
  `organism_symbol` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `biocore`.`ngs_samples` 
DROP COLUMN `organism`,
ADD COLUMN `organism_id` INT NULL DEFAULT NULL AFTER `source_id`;

CREATE TABLE `biocore`.`ngs_genotype` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `genotype` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `biocore`.`ngs_samples` 
DROP COLUMN `genotype`,
ADD COLUMN `genotype_id` INT NULL DEFAULT NULL AFTER `organism_id`;

CREATE TABLE `biocore`.`ngs_molecule` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `molecule` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `biocore`.`ngs_samples` 
DROP COLUMN `molecule`,
ADD COLUMN `molecule_id` INT NULL DEFAULT NULL AFTER `genotype_id`;

CREATE TABLE `biocore`.`ngs_library_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `library_type` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `biocore`.`ngs_samples` 
DROP COLUMN `library_type`,
ADD COLUMN `library_type_id` INT NULL DEFAULT NULL AFTER `molecule_id`;

CREATE TABLE `biocore`.`ngs_donor` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `donor` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `biocore`.`ngs_samples` 
DROP COLUMN `donor`,
ADD COLUMN `donor_id` INT NULL DEFAULT NULL AFTER `library_type_id`;

CREATE TABLE `biocore`.`ngs_biosample_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `biosample_type` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `biocore`.`ngs_samples` 
DROP COLUMN `biosample_type`,
ADD COLUMN `biosample_type_id` INT NULL DEFAULT NULL AFTER `donor_id`;

CREATE TABLE `biocore`.`ngs_instrument_model` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `instrument_model` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `biocore`.`ngs_samples` 
DROP COLUMN `instrument_model`,
ADD COLUMN `instrument_model_id` INT NULL DEFAULT NULL AFTER `biosample_type_id`;

CREATE TABLE `biocore`.`ngs_treatment_manufacturer` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `treatment_manufacturer` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `biocore`.`ngs_samples` 
DROP COLUMN `treatment_manufacturer`,
ADD COLUMN `treatment_manufacturer_id` INT NULL DEFAULT NULL AFTER `instrument_model_id`;

CREATE TABLE `biocore`.`ngs_library_strategy` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `library_strategy` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

