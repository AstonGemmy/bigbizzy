-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 14, 2022 at 03:13 PM
-- Server version: 8.0.28
-- PHP Version: 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bigbizzy`
--

-- --------------------------------------------------------

--
-- Table structure for table `sellers_data`
--

DROP TABLE IF EXISTS `sellers_data`;
CREATE TABLE IF NOT EXISTS `sellers_data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `business_category` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `business_name` varchar(255) DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  `keywords` varchar(255) DEFAULT NULL,
  `ceo_name` varchar(255) DEFAULT NULL,
  `ceo_profile_picture` varchar(255) DEFAULT NULL,
  `ceo_phone_no` varchar(255) DEFAULT NULL,
  `business_address` varchar(255) DEFAULT NULL,
  `business_image` varchar(255) DEFAULT NULL,
  `business_overview` varchar(255) DEFAULT NULL,
  `business_email` varchar(255) DEFAULT NULL,
  `isDeleted` enum('Y','N') NOT NULL DEFAULT 'N',
  `website` varchar(255) DEFAULT NULL,
  `subscription_status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sellers_data`
--

INSERT INTO `sellers_data` (`id`, `business_category`, `state`, `business_name`, `region`, `keywords`, `ceo_name`, `ceo_profile_picture`, `ceo_phone_no`, `business_address`, `business_image`, `business_overview`, `business_email`, `isDeleted`, `website`, `subscription_status`) VALUES
(1, 'Bar', 'Lagos', 'Apple Bar', 'East', 'Drinks,Meat,Beer,Star,Enjoyment', 'John Doe', 'images/profile pictures/1.jpg', '234804653723', '26 Brookvile Nest, California', 'images/business-images/1.jpg', 'Apple Bar is the best in the west coast ready to serve you with the best of grilled toasts and shit. All you gotta do is put your money through and we spit you the toast. Boom! There you go.', 'business@applebar.com', 'N', 'https://applebar.com', NULL),
(2, 'Education', 'Enugu', 'Paddington Academy', 'West Coast', 'Books,Knowledge,Research,Data,Learning', 'Paddan Brown', 'images/profile pictures/2.jpg', '23475364986', '26 Matty Lane, New York', 'images/business-images/2.jpg', 'Welcome to Paddington Academy. All you gotta do is give us your kids and watch us pull the shit outta him and replace it with good morales and virtue. Don\'t worry if we have one, we could even steal one for your child! Lol! Just bring his ass. Dang!', 'scholar.edu@paddy.com', 'N', 'https://paddingtonacademy.edu', NULL),
(3, 'Construction', 'Port Harcourt', 'Julius & Co.', 'South East', 'Site,Tools,Concrete,Cement', 'Julius Berger', 'images/profile pictures/3.jpg', '23475364986', '26 Park Lane, New York', 'images/business-images/3.jpg', 'Welcome to Paddington Academy. All you gotta do is give us your kids and watch us pull the shit outta him and replace it with good morales and virtue. Don\'t worry if we have one, we could even steal one for your child! Lol! Just bring his ass. Dang!', 'scholar.edu@paddy.com', 'N', 'https://paddingtonacademy.edu', NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
