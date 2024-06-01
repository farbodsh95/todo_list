CREATE DATABASE todo_list;
USE todo_list;

-- Create the columns table
CREATE TABLE IF NOT EXISTS `columns` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `state` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`id`)
);

-- Create the tasks table
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `description` VARCHAR(150) NOT NULL,
  `owner` VARCHAR(50) NOT NULL,
  `column_id` INT NOT NULL,
  `order` INT NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`column_id`) REFERENCES `columns`(`id`)
);

-- Insert states in the columns table
INSERT INTO `columns` (state) VALUES ("Backlog"), ("To Do"), ("In Progress"), ("Done");