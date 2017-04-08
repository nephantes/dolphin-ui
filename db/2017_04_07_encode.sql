ALTER TABLE  `ngs_conds`
ADD  `treatment_term_id` VARCHAR( 100 ) NOT NULL ,
ADD  `treatment_type` VARCHAR( 100 ) NOT NULL ;


ALTER TABLE  `ngs_sample_conds`
ADD  `uuid` VARCHAR( 100 ) NOT NULL ;