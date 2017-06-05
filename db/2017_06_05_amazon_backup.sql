CREATE TABLE `amazon_backup` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `file_name` text NOT NULL,
  `s3bucket` varchar(255) DEFAULT NULL,
  `checksum` varchar(255) DEFAULT NULL,
  `backup_checksum` varchar(255) DEFAULT NULL,
  `original_checksum` varchar(255) DEFAULT NULL,
  `checksum_recheck` varchar(255) DEFAULT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `perms` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  `last_modified_user` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

