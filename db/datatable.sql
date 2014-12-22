-- MySQL dump 10.13  Distrib 5.6.22, for osx10.8 (x86_64)
--
-- Host: localhost    Database: biocore
-- ------------------------------------------------------
-- Server version	5.6.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `datatables`
--

DROP TABLE IF EXISTS `datatables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `datatables` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) DEFAULT NULL,
  `parent_name` varchar(128) DEFAULT NULL,
  `parent_link` varchar(256) DEFAULT NULL,
  `tablename` varchar(45) DEFAULT NULL,
  `joined` binary(1) DEFAULT '0',
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `datatables`
--

LOCK TABLES `datatables` WRITE;
/*!40000 ALTER TABLE `datatables` DISABLE KEYS */;
INSERT INTO `datatables` VALUES (1,'Experiment Series','NGS Tracking','ngstracking','ngs_experiment_series','0','2014-12-18 17:54:37','2014-12-18 17:54:37','USERNAME'),(2,'Contributors','NGS Tracking','ngstracking','ngs_contributors','1','2014-12-18 23:03:01','2014-12-19 19:29:39','kucukura'),(3,'Data Tables','Administration','admin','datatables','0','2014-12-19 11:56:18','2014-12-21 21:27:58','kucukura'),(4,'Data Fields','Administration','admin','datafields','1','2014-12-19 19:28:17','2014-12-21 21:27:42','kucukura'),(5,'Lanes','NGS Tracking','ngstracking','ngs_lanes','1','2014-12-19 19:29:17','2014-12-19 19:40:39','kucukura'),(6,'Protocols','NGS Tracking','ngstracking','ngs_protocols','0','2014-12-20 12:59:55','2014-12-20 12:59:55','kucukura'),(7,'Samples','NGS Tracking','ngstracking','ngs_samples','1','2014-12-20 13:01:51','2014-12-20 13:01:51','kucukura'),(8,'Directories','NGS Tracking','ngstracking','ngs_dirs','0','2014-12-20 13:04:17','2014-12-20 13:04:17','kucukura'),(9,'Fastq Files','NGS Tracking','ngstracking','ngs_fastq_files','1','2014-12-20 14:28:56','2014-12-20 14:42:55','kucukura'),(10,'Users','Administration','admin','users','1','2014-12-21 18:23:31','2014-12-21 21:28:40','kucukura'),(11,'Groups','Administration','admin','groups','0','2014-12-21 19:00:11','2014-12-21 21:28:09','kucukura'),(12,'Sidebar','Administration','admin','sidebar','0','2014-12-21 19:07:24','2014-12-21 21:28:22','kucukura');
/*!40000 ALTER TABLE `datatables` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `datafields`
--

DROP TABLE IF EXISTS `datafields`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `datafields` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table_id` int(11) DEFAULT NULL,
  `fieldname` varchar(45) DEFAULT NULL,
  `title` varchar(128) DEFAULT NULL,
  `summary` text,
  `type` varchar(45) DEFAULT NULL,
  `len` int(11) DEFAULT NULL,
  `options` text,
  `render` text,
  `joinedtablename` varchar(45) DEFAULT NULL,
  `joinedfieldidname` varchar(45) DEFAULT NULL,
  `joinedtargetfield` varchar(45) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_fieldname` (`fieldname`,`table_id`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `datafields`
--

LOCK TABLES `datafields` WRITE;
/*!40000 ALTER TABLE `datafields` DISABLE KEYS */;
INSERT INTO `datafields` VALUES (1,1,'experiment_name','Title','Unique title that describes the overall study.','text',45,NULL,NULL,'','','','2014-12-18 00:00:00','2014-12-18 22:39:54','kucukura'),(2,1,'summary','Summary','Thorough description of the goals and objectives of this study. The abstract from the associated publication may be suitable. Include as much text as necessary.','text',256,NULL,NULL,'','','','2014-12-18 00:00:00','2014-12-19 08:10:29','kucukura'),(3,1,'design','Overall Design','Indicate how many Samples are analyzed, if replicates are included, are there control and/or reference Samples, etc.','text',256,NULL,NULL,NULL,NULL,NULL,'2014-12-18 00:00:00','2014-12-18 00:00:00','kucukura'),(4,2,'series_id','Experiment Series','The title that describes the overall study.','text',10,NULL,NULL,'ngs_experiment_series','id','experiment_name','2014-12-18 23:06:18','2014-12-19 08:26:39','kucukura'),(5,2,'contributor','Contributor','Contibutor name.','text',256,NULL,NULL,'','','','2014-12-18 23:07:00','2014-12-19 08:27:00','kucukura'),(6,3,'name','Name','Name of the data table.','text',45,NULL,NULL,'','','','2014-12-19 11:57:15','2014-12-19 11:57:15','kucukura'),(7,3,'parent_name','Parent Name','ame of the parent for bread crumbs.','text',256,NULL,NULL,'','','','2014-12-19 11:58:00','2014-12-19 11:58:00','kucukura'),(8,3,'parent_link','Parent Link','The link of the parent for bread crumbs','text',128,NULL,NULL,'','','','2014-12-19 11:58:53','2014-12-19 11:58:53','kucukura'),(10,3,'tablename','Table Name','Table name in the html form and database','text',45,NULL,NULL,'','','','2014-12-19 12:01:14','2014-12-19 12:01:14','kucukura'),(11,3,'joined','Joined?','(Yes/No) Yes: if there are other tables that are going to be joined(left)','radio',1,'\"type\":  \"radio\",                                 \"ipOpts\": [                                 { label: \"No\", value: 0 },                                 { label: \"Yes\",  value: 1 }                                 ],                                 \"default\": 0,','\"render\": function (val, type, row) {\n                          return val == 0 ? \"No\" : \"Yes\";\n                        } ','','','','2014-12-19 12:01:51','2014-12-19 12:01:51','kucukura'),(12,4,'table_id','Table name','Name of the data table','text',10,'','','datatables','id','tablename','2014-12-19 19:38:19','2014-12-19 19:40:10','kucukura'),(13,4,'fieldname','Field Name','Name of the field','text',45,'','','','','','2014-12-19 19:39:07','2014-12-19 19:39:07','kucukura'),(14,4,'title','Title','The title of the field that is going to be shown in the html presentation.','text',256,'','','','','','2014-12-19 19:41:25','2014-12-21 02:37:28','kucukura'),(15,4,'summary','Summary','Short explanation of the field','text',256,'','','','','','2014-12-19 19:41:49','2014-12-19 19:41:49','kucukura'),(16,4,'type','Type','Type of the field. Text, Date, blob, etc.','text',45,'','','','','','2014-12-19 19:42:25','2014-12-19 19:42:25','kucukura'),(17,4,'len','Len','Length of the field that is going to be used to set box size in the html','number',10,'','','','','','2014-12-19 19:42:58','2014-12-19 19:42:58','kucukura'),(18,4,'options','Options','Options is used in dataTable editor section','text',256,'','','','','','2014-12-19 19:43:38','2014-12-19 19:43:38','kucukura'),(19,4,'render','Render','Render is used in dataTable section','text',256,'','','','','','2014-12-19 19:44:06','2014-12-19 19:44:06','kucukura'),(20,4,'joinedtablename','Joined Table Name','If the main table is going to be joined other table, describe its name','text',45,'','','','','','2014-12-19 19:44:43','2014-12-19 19:44:43','kucukura'),(21,4,'joinedfieldidname','Joined Field ID Name','The name of the field that is going to be used in left join. Ex: Usually id<','text',45,'','','','','','2014-12-19 19:45:42','2014-12-19 19:45:42','kucukura'),(22,4,'joinedtargetfield','Joined Target Field','The value field that are going to be used in the box or html rather than id.','text',45,'','','','','','2014-12-19 19:46:13','2014-12-19 19:46:13','kucukura'),(23,5,'series_id','Series Name','The title that describes the overall study.','text',10,'','','ngs_experiment_series','id','experiment_name','2014-12-19 20:16:02','2014-12-19 20:16:02','kucukura'),(24,5,'name','Lane Name','Unique name that describes the lane. ','text',128,'','','','','','2014-12-19 20:17:04','2014-12-19 20:17:29','kucukura'),(25,5,'facility','Sequencing Facility','Describe the facility you used for sequencing.','text',128,'','','','','','2014-12-19 20:18:23','2014-12-19 20:18:23','kucukura'),(26,5,'cost','Cost','Sequencing cost of the lane','text',20,'','','','','','2014-12-19 20:19:00','2014-12-19 20:19:00','kucukura'),(27,5,'date_submitted','Date Submitted','Submission date','date',10,'\"type\": \"date\", 				\"dateImage\" : \"/dolphin/public/img/calender.png\",                 		\"def\": function () { return new Date(); },                 		dateFormat: $.datepicker.ISO_8601','','','','','2014-12-19 20:19:30','2014-12-19 20:29:29','kucukura'),(28,5,'date_received','Date Received','Received date','date',10,'\"type\": \"date\", 				\"dateImage\" : \"/dolphin/public/img/calender.png\",                 		\"def\": function () { return new Date(); },                 		dateFormat: $.datepicker.ISO_8601','','','','','2014-12-19 20:20:20','2014-12-19 20:29:17','kucukura'),(29,5,'total_reads','Total reads','Total # of sequenced reads in the lane','text',30,'','','','','','2014-12-19 20:21:30','2014-12-19 20:21:30','kucukura'),(30,5,'phix_requested','% PhiX requested','(Yes/No) - Illumina recommends using PhiX Control v3 (Catalog # FC-110-3001) in a lowconcentration spike-in (1%) for improved sequencing quality control','radio',1,'\"type\":  \"radio\",                 		\"ipOpts\": [                     		{ label: \"No\", value: \"No\" },                     		{ label: \"Yes\",  value: \"Yes\" }                 		],                 		\"default\": \"No\"','','','','','2014-12-19 20:23:23','2014-12-19 20:23:41','kucukura'),(31,5,'phix_in_lane','% PhiX in lane','Spike-in concentration (%)','text',10,'','','','','','2014-12-19 20:24:25','2014-12-20 12:54:02','kucukura'),(32,5,'total_samples','# of Samples','The number of sampels in the lane','text',3,'','','','','','2014-12-19 20:25:17','2014-12-19 20:25:17','kucukura'),(33,5,'resequenced','Resequenced?','(Yes/No) - Is this resequenced library?','radio',1,'\"type\":  \"radio\",                 		ipOpts: [                     		{ label: \"No\", value: 0 },                     		{ label: \"Yes\",  value: 1 }                 		],                 		\"default\": 0 ','\"render\": function (val, type, row) {                     	  return val == 0 ? \"No\" : \"Yes\";                 	}	 ','','','','2014-12-19 20:27:35','2014-12-19 20:27:35','kucukura'),(34,5,'notes','Notes','Free text notes field to describe the lane','text',256,'','','','','','2014-12-19 20:28:10','2014-12-19 20:28:10','kucukura'),(35,6,'name','Protocol Name','Unique protocol name that describes the overall protocol.','text',256,'','','','','','2014-12-20 13:05:20','2014-12-20 13:05:20','kucukura'),(36,6,'growth','Growth Protocol','Describe the conditions that were used to grow or maintain organisms or cells prior to extract preparation.','text',256,'','','','','','2014-12-20 13:06:01','2014-12-20 13:06:01','kucukura'),(37,6,'treatment','Treatment Protocol','Describe the treatments applied to the biological material prior to extract preparation.','text',256,'','','','','','2014-12-20 13:06:43','2014-12-20 13:06:43','kucukura'),(38,6,'extraction','Extract Protocol','Describe the protocols used to extract and prepare the material to be sequenced.','text',256,'','','','','','2014-12-20 13:07:20','2014-12-20 13:07:36','kucukura'),(39,6,'library_construction','Library Construction Protocol','Describe the library construction protocol.','text',256,'','','','','','2014-12-20 13:08:15','2014-12-20 13:08:15','kucukura'),(40,6,'library_strategy','Library Strategy','A Short Read Archive-specific field that describes the sequencing technique for this library.','text',256,'','','','','','2014-12-20 13:08:51','2014-12-20 13:08:51','kucukura'),(41,7,'series_id','Series Name','The title that describes the overall study.','text',10,'','','ngs_experiment_series','id','experiment_name','2014-12-20 14:00:31','2014-12-20 14:02:02','kucukura'),(42,7,'lane_id','Lane Name','The name that describes the lane.','text',10,'','','ngs_lanes','id','name','2014-12-20 14:01:49','2014-12-20 14:01:49','kucukura'),(43,7,'protocol_id','Protocol Name','The name that describes the protocol.','text',10,'','','ngs_protocols','id','name','2014-12-20 14:03:14','2014-12-20 14:03:14','kucukura'),(44,7,'name','Sample Name','Unique name that describes the sample. Please don\'t use any characters other than numbers, letters and udnerscore.','text',128,'','','','','','2014-12-20 14:04:00','2014-12-20 14:04:00','kucukura'),(45,7,'barcode','Barcode','Describe the barcode you used for the sample','text',30,'','','','','','2014-12-20 14:04:56','2014-12-20 14:04:56','kucukura'),(46,7,'title','Title','Unique title that describes the Sample.','text',128,'','','','','','2014-12-20 14:05:24','2014-12-20 18:42:00','kucukura'),(47,7,'source','Source','Briefly identify the biological material, cell line or tissue e.g., vastus lateralis muscle.','text',128,'','','','','','2014-12-20 14:06:00','2014-12-20 14:06:35','kucukura'),(48,7,'organism','Organism','Identify the organism(s) from which the sequences were derived.','text',128,'','','','','','2014-12-20 14:06:22','2014-12-20 14:06:22','kucukura'),(49,7,'molecule','Molecule','Type of molecule that was extracted from the biological material. Include one of the following: total RNA, polyA RNA, cytoplasmic RNA, nuclear RNA, genomic DNA, protein, or other.','text',128,'','','','','','2014-12-20 14:07:13','2014-12-20 14:07:13','kucukura'),(50,7,'description','Description','Detailed sample description.','text',256,'','','','','','2014-12-20 14:07:34','2014-12-20 14:07:34','kucukura'),(51,7,'instrument_model','Instrument Model','The model of the next generation sequencing machine','text',128,'','','','','','2014-12-20 14:08:15','2014-12-20 14:16:07','kucukura'),(52,7,'avg_insert_size','Avg. Insert Size','Average size of the insert for paired-end reads (excluding adapters, linkers, etc...)','number',10,'','','','','','2014-12-20 14:08:52','2014-12-20 14:08:52','kucukura'),(53,7,'read_length','Read Length','Sequenced read length.','number',10,'','','','','','2014-12-20 14:09:28','2014-12-20 14:09:28','kucukura'),(54,7,'genotype','Genotype','Describe the genetic makeup of a specific organism.','text',128,'','','','','','2014-12-20 14:09:52','2014-12-20 14:09:52','kucukura'),(55,7,'condition','Condition','Describe the sample condition.','text',256,'','','','','','2014-12-20 14:10:22','2014-12-20 14:10:22','kucukura'),(56,7,'library_type','Library Type','Library Type. (RNASeq, ChipSeq etc.)','text',128,'','','','','','2014-12-20 14:11:18','2014-12-20 14:11:18','kucukura'),(57,7,'adapter','3\' Adapter','3\' Adapter sequence','text',45,'','','','','','2014-12-20 14:11:53','2014-12-20 14:11:53','kucukura'),(58,7,'notebook_ref','Notebook Referance','Corresponding notebook reference of the sample','text',128,'','','','','','2014-12-20 14:12:42','2014-12-20 14:12:42','kucukura'),(59,7,'notes','Notes','Free text notes field to describe the sample.','text',256,'','','','','','2014-12-20 14:13:09','2014-12-20 14:13:09','kucukura'),(60,8,'fastq_dir','Fastq Directory','Full path of the fastq files.','text',256,'','','','','','2014-12-20 14:21:20','2014-12-20 14:22:04','kucukura'),(61,8,'backup_dir','Backup Directory','Full path of the backup directiory','text',256,'','','','','','2014-12-20 14:21:53','2014-12-20 14:21:53','kucukura'),(62,8,'amazon_bucket','Amazon Bucket','Amazon bucket name. If this field is not empty and amazon bucket exits under your credentials and your amazon credentials are defined in the system. The fastq files are going to be copied to Amazon S3 storage.','text',256,'','','','','','2014-12-20 14:22:40','2014-12-20 14:22:54','kucukura'),(63,9,'lane_id','Lane Name','The name that describes the lane.','text',10,'','','ngs_lanes','id','name','2014-12-20 14:29:46','2014-12-20 14:30:50','kucukura'),(64,9,'sample_id','Sample Name','The title that describes sample.','text',10,'','','ngs_samples','id','name','2014-12-20 14:30:32','2014-12-20 14:30:32','kucukura'),(65,9,'dir_id','Fastq Directory','The directory of the fastq files.','text',10,'','','ngs_dirs','id','fastq_dir','2014-12-20 14:31:45','2014-12-20 14:42:16','kucukura'),(66,9,'file_name','File Name','Name of the file without its path','text',256,'','','','','','2014-12-20 14:38:10','2014-12-20 14:44:49','kucukura'),(67,9,'checksum','Checksum','MD5 checksum of the file. This helps us verify that the file transfer was complete and didn\'t corrupt your file.','text',50,'','','','','','2014-12-20 14:36:07','2014-12-20 14:36:07','kucukura'),(69,10,'username','Username','Email username. Usually the last name and the first letter of the firstname.','text',8,'','','','','','2014-12-21 18:29:34','2014-12-21 18:29:34','kucukura'),(70,10,'group_id','Group Name','Group name the user belong to.  ','text',45,'','','groups','id','name','2014-12-21 18:30:40','2014-12-21 18:30:40','kucukura'),(71,10,'clusteruser','Cluster Username','The username in the cluster.','text',10,'','','','','','2014-12-21 18:31:54','2014-12-21 18:31:54','kucukura'),(72,10,'role','Role','Job description.','text',128,'','','','','','2014-12-21 18:32:55','2014-12-21 18:32:55','kucukura'),(73,10,'name','Full Name','Full name of the user. Please enter first full name using following format. Last Name, First Name','text',128,'','','','','','2014-12-21 18:34:10','2014-12-21 18:34:10','kucukura'),(74,10,'email','Email','Unique email address','text',128,'','','','','','2014-12-21 18:34:51','2014-12-21 18:34:51','kucukura'),(75,10,'institute','Institute','The name of the institution. ','text',128,'','','','','','2014-12-21 18:36:03','2014-12-21 18:36:03','kucukura'),(76,10,'lab','Lab Name','The name of the lab','text',128,'','','','','','2014-12-21 18:36:58','2014-12-21 18:36:58','kucukura'),(77,10,'memberdate','Date of membership','The date of the membership to the system.','data',10,'','','','','','2014-12-21 18:40:35','2014-12-21 18:40:35','kucukura'),(78,11,'name','Group Name','User group name in the institute, usuall labname.','text',128,'','','','','','2014-12-21 19:01:05','2014-12-21 19:01:05','kucukura'),(79,12,'name','Menu Name','The name of the menu that will appear in the sidebar','text',45,'','','','','','2014-12-21 19:08:57','2014-12-21 19:08:57','kucukura'),(80,12,'parent_name','Parent Name','Parent name of the menu ','text',45,'','','','','','2014-12-21 19:10:07','2014-12-21 21:11:39','kucukura'),(81,12,'link','Link','The link of the page.','text',128,'','','','','','2014-12-21 19:10:59','2014-12-21 19:10:59','kucukura'),(82,12,'iconname','Icon','CSS Icon name that will appear next to the parent name','text',45,'','','','','','2014-12-21 19:12:58','2014-12-21 19:12:58','kucukura'),(83,12,'treeview','Tree View','Yes/No: If there are sub menus, this should be set yes','radio',1,'\"type\":  \"radio\",                                \n \"ipOpts\": [                                 \n{ label: \"No\", value: 0 },                                \n { label: \"Yes\",  value: 1 }                                 ],                                 \n\"default\": 0,','\"render\": function (val, type, row) {\n                          return val == 0 ? \"No\" : \"Yes\";\n                        } ','','','','2014-12-21 20:07:56','2014-12-21 20:07:56','kucukura');
/*!40000 ALTER TABLE `datafields` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sidebar`
--

DROP TABLE IF EXISTS `sidebar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sidebar` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `parent_name` varchar(45) DEFAULT NULL,
  `link` text,
  `iconname` varchar(45) DEFAULT NULL,
  `treeview` binary(1) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1001 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sidebar`
--

LOCK TABLES `sidebar` WRITE;
/*!40000 ALTER TABLE `sidebar` DISABLE KEYS */;
INSERT INTO `sidebar` VALUES (1,'Dashboard','','/','fa-dashboard','0','2014-12-21 19:33:20','2014-12-21 19:33:20','kucukura'),(2,'NGS Tracking','','','fa-bar-chart-o','1','2014-12-21 19:35:07','2014-12-21 19:35:07','kucukura'),(3,'Usage Reports','','','fa-bar-chart-o','1','2014-12-21 19:36:42','2014-12-21 19:36:42','kucukura'),(4,'Excel Import','NGS Tracking','ngsimport','','0','2014-12-21 19:38:02','2014-12-21 19:38:02','kucukura'),(5,'NGS Tracking','NGS Tracking','ngstrack','','0','2014-12-21 19:38:44','2014-12-21 19:38:44','kucukura'),(6,'Galaxy Stats','Usage Reports','galaxystats','','0','2014-12-21 19:39:28','2014-12-21 19:39:28','kucukura'),(7,'Dolphin Stats','Usage Reports','dolphinstats','','0','2014-12-21 19:40:29','2014-12-21 19:40:29','kucukura'),(8,'Administration','','','fa-laptop','1','2014-12-21 19:41:10','2014-12-21 19:41:10','kucukura');
/*!40000 ALTER TABLE `sidebar` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-12-21 21:44:10
