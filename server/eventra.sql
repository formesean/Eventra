-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 26, 2025 at 08:51 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `eventra`
--

-- --------------------------------------------------------

--
-- Table structure for table `event`
--

CREATE TABLE `event` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) NOT NULL,
  `location` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `attendees` int(11) NOT NULL DEFAULT 0,
  `organizer` varchar(191) NOT NULL,
  `capacity` varchar(191) DEFAULT NULL,
  `endTime` varchar(191) NOT NULL,
  `hasCapacity` tinyint(1) NOT NULL DEFAULT 0,
  `hasTickets` tinyint(1) NOT NULL DEFAULT 0,
  `isFree` tinyint(1) NOT NULL DEFAULT 1,
  `requiresApproval` tinyint(1) NOT NULL DEFAULT 0,
  `startTime` varchar(191) NOT NULL,
  `timezone` varchar(191) DEFAULT NULL,
  `bannerUrl` varchar(191) DEFAULT NULL,
  `goingCount` int(11) NOT NULL DEFAULT 0,
  `maybeCount` int(11) NOT NULL DEFAULT 0,
  `notGoingCount` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `event`
--

INSERT INTO `event` (`id`, `userId`, `name`, `description`, `startDate`, `endDate`, `location`, `createdAt`, `updatedAt`, `attendees`, `organizer`, `capacity`, `endTime`, `hasCapacity`, `hasTickets`, `isFree`, `requiresApproval`, `startTime`, `timezone`, `bannerUrl`, `goingCount`, `maybeCount`, `notGoingCount`) VALUES
(2, 2, '[CPEC] Tulay Midterms Tutorials (1st Semester)', 'Midterm exam preparation session', '2025-05-18 07:37:18.234', '2025-05-18 07:37:18.234', 'University of San Carlos - Talamban Campus', '2025-05-18 15:37:41.907', '0000-00-00 00:00:00.000', 0, 'Sean Aguilar', 'Unlimited', '04:37 PM', 1, 1, 1, 1, '03:37 PM', 'GMT+08:00 Manila', '/stock-banner-1.jpg', 0, 0, 0),
(6, 2, 'RoboSports', 'Robotics Competition', '2025-05-24 23:00:00.000', '2025-05-25 08:00:00.000', 'CTU Danao', '2025-05-24 17:33:08.791', '0000-00-00 00:00:00.000', 0, 'Sean Aguilar', 'Unlimited', '04:00 PM', 1, 0, 1, 0, '07:00 AM', 'GMT+08:00 Manila', '/stock-banner-1.jpg', 0, 0, 0),
(20, 2, 'Formula 1 Aramco Gran Premio De España 2025 - Qualifying', 'Formula 1 Aramco Gran Premio De España 2025 - Qualifying', '2025-05-30 06:00:00.000', '2025-05-30 07:00:00.000', 'Spain', '2025-05-25 22:39:38.374', '0000-00-00 00:00:00.000', 1, 'Sean Aguilar', 'Unlimited', '11:39 PM', 1, 0, 1, 1, '10:00 PM', 'GMT+08:00 Manila', '/stock-banner-4.jpg', 1, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `registration`
--

CREATE TABLE `registration` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `eventId` int(11) NOT NULL,
  `fullName` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `contactNumber` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'going',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `registration`
--

INSERT INTO `registration` (`id`, `userId`, `eventId`, `fullName`, `email`, `contactNumber`, `status`, `createdAt`, `updatedAt`) VALUES
(3, 3, 20, 'Sean Karl Tyrese', '22101612@usc.edu.ph', '0915098943', 'going', '2025-05-26 13:01:34.000', '2025-05-26 13:50:18.000');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(191) NOT NULL,
  `name` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `name`, `createdAt`, `updatedAt`) VALUES
(2, 'seanaguilar698@gmail.com', 'Sean Aguilar', '2025-05-17 20:32:59.863', '0000-00-00 00:00:00.000'),
(3, '22101612@usc.edu.ph', 'Sean Karl Tyrese Aguilar', '2025-05-26 01:04:26.792', '0000-00-00 00:00:00.000');

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('00c75ff4-c6b6-411f-8dd5-907ea5c5c726', 'c79e828242c7fdfae262ea6f5e5ff29158ab73c305c33743780eece59f038475', '2025-05-25 14:14:04.852', '20250525141404_add_banner_to_event', NULL, NULL, '2025-05-25 14:14:04.787', 1),
('1e00f89b-a282-4c97-a0d3-9289c20ebf73', '50349f90eb220588e95508cbf3668f261a8a59761132650f75f7177a8901bf46', '2025-05-25 17:09:01.033', '20250525170900_add_event_registrations', NULL, NULL, '2025-05-25 17:09:00.888', 1),
('4237c63e-c098-4b01-b91c-bbad77a8aefb', 'e3d29965bb1c778d244282dd409453624db6ca2a8a2c3d309bf39f5c9176a4d0', '2025-05-26 04:50:48.208', '20250526045047_add_rsvp_status_counts', NULL, NULL, '2025-05-26 04:50:48.168', 1),
('5116fcef-34c3-426f-8213-d872a9bc6cae', 'e115fe61c6da326ccb9f7cb1aabad196e626c20816ea521c35c0c87a75581223', '2025-05-13 06:37:03.144', '20250513063702_init', NULL, NULL, '2025-05-13 06:37:03.077', 1),
('85d83e81-5628-4b67-ab19-24fb7f470efd', '9417e654569b896db5f10c330e647bffb6ad361fb6be8d67d0c5b04f0a5b1283', '2025-05-13 06:38:09.980', '20250513063809_add_events_table', NULL, NULL, '2025-05-13 06:38:09.856', 1),
('99890714-a8b6-45c3-b62c-5a688d751699', '50836c7a893e1abac19935ad2b8562f643657aabea4cad07030e431b06424dac', '2025-05-25 17:17:58.143', '20250525171757_update_event_registrations', NULL, NULL, '2025-05-25 17:17:57.836', 1),
('ac1fb8e8-2628-41c6-b110-73c30d296f84', '1471fc7d8219a390679ba748ab91ada25aa67fba846a1768e82207d06d29fbfd', '2025-05-13 06:56:49.320', '20250513065649_remove_google_id', NULL, NULL, '2025-05-13 06:56:49.271', 1),
('aeb6559d-2240-48fe-8538-302ccd9235b9', 'c071a7a30cba9101fb86ed91cc70e088635ef89515c2498759957f38cb4c7d4f', '2025-05-18 06:56:25.966', '20250518065625_update_event_table', NULL, NULL, '2025-05-18 06:56:25.903', 1),
('c05294a3-3440-4629-80d6-519713a44ea6', 'e61e7c306ecd515961f94aa7b90ad6b149ab3d6ef59c8e953a8468a7713ed6a5', '2025-05-18 05:55:42.850', '20250518055542_update_event_table', NULL, NULL, '2025-05-18 05:55:42.806', 1),
('dd17c435-e4ee-4c14-a8ea-b3f0e0e79d51', '97a3a897428e58ddfd0d3ab270b36375f9d800fd9d63553a94010a2110788d95', '2025-05-17 12:39:27.457', '20250517123927_update_event_table', NULL, NULL, '2025-05-17 12:39:27.430', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Event_userId_fkey` (`userId`);

--
-- Indexes for table `registration`
--
ALTER TABLE `registration`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Registration_eventId_email_key` (`eventId`,`email`),
  ADD KEY `Registration_userId_fkey` (`userId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `event`
--
ALTER TABLE `event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `registration`
--
ALTER TABLE `registration`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `event`
--
ALTER TABLE `event`
  ADD CONSTRAINT `Event_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `registration`
--
ALTER TABLE `registration`
  ADD CONSTRAINT `Registration_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `event` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Registration_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
