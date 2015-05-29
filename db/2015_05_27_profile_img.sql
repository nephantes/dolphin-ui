ALTER TABLE `biocore`.`users` 
ADD COLUMN `photo_loc` VARCHAR(255) NOT NULL DEFAULT '/public/img/avatar5.png' AFTER `lab`;
