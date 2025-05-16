--
-- Table structure for table `block`
--

DROP TABLE IF EXISTS `block`;
CREATE TABLE `block` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) DEFAULT NULL,
  `Description` varchar(100) DEFAULT NULL,
  `Author` int DEFAULT NULL,
  `Preview` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `Author` (`Author`),
  CONSTRAINT `block_ibfk_1` FOREIGN KEY (`Author`) REFERENCES `user` (`PersonId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `video`
--

DROP TABLE IF EXISTS `video`;
CREATE TABLE `video` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) DEFAULT NULL,
  `Description` varchar(100) DEFAULT NULL,
  `BlockId` int DEFAULT NULL,
  `Link` varchar(500) DEFAULT NULL,
  `Cost` int DEFAULT NULL,
  `Preview` varchar(500) DEFAULT NULL,
  `Author` int DEFAULT NULL,
  `profanity` BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (`Id`),
  KEY `BlockId` (`BlockId`),
  KEY `fk_author` (`Author`),
  CONSTRAINT `fk_author` FOREIGN KEY (`Author`) REFERENCES `user` (`PersonId`) ON DELETE SET NULL,
  CONSTRAINT `video_ibfk_1` FOREIGN KEY (`BlockId`) REFERENCES `block` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
