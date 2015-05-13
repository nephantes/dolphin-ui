ALTER TABLE `biocore`.`ngs_runparams` 
ADD COLUMN `owner_id` int(11) DEFAULT NULL AFTER `run_description`,
ADD COLUMN `group_id` int(11) DEFAULT NULL AFTER `owner_id`,
ADD COLUMN `perms` int(11) DEFAULT NULL AFTER `group_id`,
ADD COLUMN `date_created` datetime DEFAULT NULL AFTER `perms`,
ADD COLUMN `date_modified` datetime DEFAULT NULL AFTER `date_created`,
ADD COLUMN `last_modified_user` int(11) DEFAULT NULL AFTER `date_modified`;
