--
-- Table structure for table `gender`
--

DROP TABLE IF EXISTS `gender`;
CREATE TABLE `gender` (
  `GenderId` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  PRIMARY KEY (`GenderId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `PersonId` int NOT NULL AUTO_INCREMENT,
  `Email` varchar(50) DEFAULT NULL,
  `Name` varchar(50) DEFAULT NULL,
  `LastName` varchar(50) DEFAULT NULL,
  `SecondName` varchar(50) DEFAULT NULL,
  `Gender` int DEFAULT NULL,
  `Verify` tinyint(1) DEFAULT '0',
  `Password` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`PersonId`),
  KEY `Gender` (`Gender`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`Gender`) REFERENCES `gender` (`GenderId`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;