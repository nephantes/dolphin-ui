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

