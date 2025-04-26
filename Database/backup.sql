-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: new
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `CustomerID` int NOT NULL AUTO_INCREMENT,
  `ProviderID` int NOT NULL,
  `Name` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Email` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Phone` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Status` tinyint DEFAULT '1',
  `Address` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Area` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `City` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `State` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `GST` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`CustomerID`),
  KEY `NonPrimary` (`ProviderID`,`Status`,`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (54,1,'Ramesh Kumar','rameshkumar@gmail.com','6787675655',1,'LIG-16, Suryadeep Tenament,Vasant Nagar,Gota','Gota','Ahmedabad','Gujarat','22AAAAA0000A1Z1'),(56,1,'Govind Kumar','govindkumar@gmail.com','8798766656',1,'LIG-16, Suryadeep Tenament,Vasant Nagar,Gota','Chandkheda','Ahmedabad','Gujarat','22AAAAA0000A1Z5');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customersalesorder`
--

DROP TABLE IF EXISTS `customersalesorder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customersalesorder` (
  `CustomerSalesOrderID` int NOT NULL AUTO_INCREMENT,
  `CustomerID` int DEFAULT NULL,
  `ProviderID` int DEFAULT NULL,
  `SalesOrderNumber` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `SalesDate` date DEFAULT NULL,
  `Status` tinyint DEFAULT '1',
  `SalesTotalPrice` decimal(18,2) DEFAULT '0.00',
  PRIMARY KEY (`CustomerSalesOrderID`),
  KEY `NonPrimary` (`CustomerID`,`ProviderID`,`SalesOrderNumber`,`Status`,`SalesDate`)
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customersalesorder`
--

LOCK TABLES `customersalesorder` WRITE;
/*!40000 ALTER TABLE `customersalesorder` DISABLE KEYS */;
INSERT INTO `customersalesorder` VALUES (113,54,1,'CPO-01','2025-04-13',1,517000.00),(114,56,1,'CPO-02','2025-04-17',1,165000.00);
/*!40000 ALTER TABLE `customersalesorder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customersalesorderitems`
--

DROP TABLE IF EXISTS `customersalesorderitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customersalesorderitems` (
  `CustomerSalesOrderItemID` int NOT NULL AUTO_INCREMENT,
  `ItemID` int NOT NULL,
  `AllocatedQty` int DEFAULT NULL,
  `UnitCost` decimal(10,2) DEFAULT '0.00',
  `Tax` int DEFAULT NULL,
  `SalesPrice` decimal(18,2) DEFAULT '0.00',
  `CustomerSalesOrderID` int NOT NULL,
  PRIMARY KEY (`CustomerSalesOrderItemID`),
  KEY `NonPrimary` (`ItemID`,`CustomerSalesOrderID`) /*!80000 INVISIBLE */
) ENGINE=InnoDB AUTO_INCREMENT=354 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customersalesorderitems`
--

LOCK TABLES `customersalesorderitems` WRITE;
/*!40000 ALTER TABLE `customersalesorderitems` DISABLE KEYS */;
INSERT INTO `customersalesorderitems` VALUES (351,49,10,23000.00,10,253000.00,113),(352,50,20,12000.00,10,264000.00,113),(353,49,5,30000.00,10,165000.00,114);
/*!40000 ALTER TABLE `customersalesorderitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items` (
  `ItemID` int NOT NULL AUTO_INCREMENT,
  `ProviderID` int NOT NULL,
  `SupplierID` int DEFAULT NULL,
  `Name` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Category` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Brand` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Status` tinyint DEFAULT NULL,
  `Description` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `ItemUnitID` int DEFAULT NULL,
  `Stock` int DEFAULT NULL,
  PRIMARY KEY (`ItemID`),
  KEY `NonPrimary` (`ProviderID`,`Status`,`Name`,`SupplierID`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (49,1,31,'Laptop','Electric','HP',1,'Good',2,30),(50,1,32,'Washing Machine','Electric','Bajaj',1,'ok',2,40);
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `itemsstock`
--

DROP TABLE IF EXISTS `itemsstock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itemsstock` (
  `ItemStockID` int NOT NULL AUTO_INCREMENT,
  `ItemID` int NOT NULL,
  `PurchasePrice` decimal(10,2) DEFAULT '0.00',
  `ProviderID` int DEFAULT NULL,
  `PurchaseDate` datetime DEFAULT NULL,
  `Qty` int DEFAULT NULL,
  `RemainingQty` int DEFAULT NULL,
  PRIMARY KEY (`ItemStockID`),
  KEY `NonPrimary` (`ItemID`,`ProviderID`,`PurchaseDate`) /*!80000 INVISIBLE */
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itemsstock`
--

LOCK TABLES `itemsstock` WRITE;
/*!40000 ALTER TABLE `itemsstock` DISABLE KEYS */;
INSERT INTO `itemsstock` VALUES (81,49,45000.00,1,'2025-04-08 00:00:00',20,20),(82,50,15000.00,1,'2025-04-15 00:00:00',40,30),(83,49,45000.00,1,'2025-04-18 00:00:00',10,10);
/*!40000 ALTER TABLE `itemsstock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `itemunits`
--

DROP TABLE IF EXISTS `itemunits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itemunits` (
  `ItemUnitID` int NOT NULL AUTO_INCREMENT,
  `UnitName` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ItemUnitID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itemunits`
--

LOCK TABLES `itemunits` WRITE;
/*!40000 ALTER TABLE `itemunits` DISABLE KEYS */;
INSERT INTO `itemunits` VALUES (1,'KG'),(2,'PCS');
/*!40000 ALTER TABLE `itemunits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `PermissionID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Description` varchar(300) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`PermissionID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `providerpermissions`
--

DROP TABLE IF EXISTS `providerpermissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `providerpermissions` (
  `ProviderPermissionID` int NOT NULL AUTO_INCREMENT,
  `ProviderID` int NOT NULL,
  `PermissionID` int NOT NULL,
  PRIMARY KEY (`ProviderPermissionID`),
  KEY `Nonprimary` (`PermissionID`,`ProviderID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `providerpermissions`
--

LOCK TABLES `providerpermissions` WRITE;
/*!40000 ALTER TABLE `providerpermissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `providerpermissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `providerrolepermissions`
--

DROP TABLE IF EXISTS `providerrolepermissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `providerrolepermissions` (
  `ProviderRolePermissionID` int NOT NULL AUTO_INCREMENT,
  `RoleID` int DEFAULT NULL,
  `PermissionsID` int DEFAULT NULL,
  PRIMARY KEY (`ProviderRolePermissionID`),
  KEY `NonPrimary` (`RoleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `providerrolepermissions`
--

LOCK TABLES `providerrolepermissions` WRITE;
/*!40000 ALTER TABLE `providerrolepermissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `providerrolepermissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `providerroles`
--

DROP TABLE IF EXISTS `providerroles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `providerroles` (
  `RoleID` int NOT NULL AUTO_INCREMENT,
  `ProviderID` int DEFAULT NULL,
  `RoleName` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`RoleID`),
  KEY `NonPrimary` (`ProviderID`) /*!80000 INVISIBLE */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `providerroles`
--

LOCK TABLES `providerroles` WRITE;
/*!40000 ALTER TABLE `providerroles` DISABLE KEYS */;
/*!40000 ALTER TABLE `providerroles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `providers`
--

DROP TABLE IF EXISTS `providers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `providers` (
  `ProviderID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(300) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Address` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Phone` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Email` varchar(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Status` tinyint DEFAULT '1',
  PRIMARY KEY (`ProviderID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `providers`
--

LOCK TABLES `providers` WRITE;
/*!40000 ALTER TABLE `providers` DISABLE KEYS */;
/*!40000 ALTER TABLE `providers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `providerusers`
--

DROP TABLE IF EXISTS `providerusers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `providerusers` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `ProviderID` int DEFAULT NULL,
  `RoleID` int DEFAULT NULL,
  `UserName` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `FirstName` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `LastName` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Email` varchar(250) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Password` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Status` tinyint DEFAULT '1',
  `Deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `UserName_UNIQUE` (`UserName`,`ProviderID`) /*!80000 INVISIBLE */,
  KEY `NonPrimary` (`ProviderID`,`UserName`,`Deleted`,`Status`) /*!80000 INVISIBLE */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `providerusers`
--

LOCK TABLES `providerusers` WRITE;
/*!40000 ALTER TABLE `providerusers` DISABLE KEYS */;
/*!40000 ALTER TABLE `providerusers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchaseorderitems`
--

DROP TABLE IF EXISTS `purchaseorderitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchaseorderitems` (
  `PurchaseOrderItemID` int NOT NULL AUTO_INCREMENT,
  `ItemID` int NOT NULL,
  `AllocatedQty` int NOT NULL,
  `UnitCost` decimal(10,2) DEFAULT '0.00',
  `PurchasePrice` decimal(18,2) DEFAULT '0.00',
  `InvoiceNumber` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `InvoiceDate` date DEFAULT NULL,
  `PurchaseOrderID` int NOT NULL,
  PRIMARY KEY (`PurchaseOrderItemID`),
  KEY `NonPrimary` (`ItemID`,`PurchaseOrderID`) /*!80000 INVISIBLE */
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchaseorderitems`
--

LOCK TABLES `purchaseorderitems` WRITE;
/*!40000 ALTER TABLE `purchaseorderitems` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchaseorderitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchaseorders`
--

DROP TABLE IF EXISTS `purchaseorders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchaseorders` (
  `PurchaseOrderID` int NOT NULL AUTO_INCREMENT,
  `CustomerSalesOrderID` int DEFAULT NULL,
  `CustomerID` int DEFAULT NULL,
  `ProviderID` int DEFAULT NULL,
  `PurchaseOrderNumber` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `PurchaseDate` date DEFAULT NULL,
  `Status` tinyint DEFAULT '1',
  `PurchaseTotalPrice` decimal(18,2) DEFAULT '0.00',
  PRIMARY KEY (`PurchaseOrderID`),
  KEY `NonPrimary` (`CustomerID`,`ProviderID`,`CustomerSalesOrderID`,`PurchaseOrderNumber`,`Status`,`PurchaseDate`)
) ENGINE=InnoDB AUTO_INCREMENT=151 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchaseorders`
--

LOCK TABLES `purchaseorders` WRITE;
/*!40000 ALTER TABLE `purchaseorders` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchaseorders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `SupplierID` int NOT NULL AUTO_INCREMENT,
  `ProviderID` int NOT NULL,
  `Name` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Email` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Phone` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Status` tinyint DEFAULT NULL,
  `Address` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Area` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `City` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `State` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `GST` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`SupplierID`),
  KEY `NonPrimary` (`ProviderID`,`Status`,`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES (31,1,'Rk Trading Com','rktc@gmail.com','7890987655',1,'LIG-16, Suryadeep Tenament,Vasant Nagar,Gota','Gandhinagar','Ahmedabad','Gujarat','22AAAAA0000A1Z1'),(32,1,'Shivam Sales','shivamsales@gmail.com','6890546786',1,'LIG-16, Suryadeep Tenament,Vasant Nagar,Gota','Gota','Ahmedabad','Gujarat','22AAAAA0000A1Z6');
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `name` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `email` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `passwordhash` varchar(1000) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `isadmin` bit(1) NOT NULL,
  `status` int NOT NULL,
  `ProviderID` int DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (23,'manthan','Manthan Panchal','Manthan@gmail.com','$2b$10$xm/DQf1IdpTaSToeJdigJulzMxb60dNySjGgPzbgdmze9lVW18Liy',_binary '\0',1,1),(24,'sawai_jangid_malani','Sawai jangid','sawaisingh0706@gmail.com','$2b$10$9brQNcdjk1Mqf/kvHFDfGuRMplV9GE8VvNTKEeKxrp9RvKFwpyK5S',_binary '\0',1,2);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-26 12:41:06
