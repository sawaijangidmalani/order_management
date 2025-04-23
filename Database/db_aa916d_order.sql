-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: mysql8010.site4now.net
-- Generation Time: Jul 18, 2024 at 12:04 PM
-- Server version: 8.0.36
-- PHP Version: 8.3.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_db_aad71a_order`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`db_aad71a_order`@`%` PROCEDURE `GetProviders` ()   BEGIN 
    SELECT ProviderID, Name, Email from providers;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `CustomerID` int NOT NULL,
  `ProviderID` int NOT NULL,
  `Name` varchar(200) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Email` varchar(200) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Phone` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Status` tinyint DEFAULT '1',
  `Address` varchar(200) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Area` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `City` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `State` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `GST` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`CustomerID`, `ProviderID`, `Name`, `Email`, `Phone`, `Status`, `Address`, `Area`, `City`, `State`, `GST`) VALUES
(1, 1, 'Customer 1', 'customer@gmail.com', '857474585', 1, 'Add of customer, city, country', 'test', 'city', 'state', 'GSTN125487');

-- --------------------------------------------------------

--
-- Table structure for table `customersalesorder`
--

CREATE TABLE `customersalesorder` (
  `CustomerSalesOrderID` int NOT NULL,
  `CustomerID` int DEFAULT NULL,
  `ProviderID` int DEFAULT NULL,
  `SalesOrderNumber` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `SalesDate` datetime DEFAULT NULL,
  `Status` tinyint DEFAULT '1',
  `SalesTotalPrice` decimal(18,2) DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customersalesorderitems`
--

CREATE TABLE `customersalesorderitems` (
  `CustomerSalesOrderItemID` int NOT NULL,
  `ItemID` int NOT NULL,
  `SalesQty` decimal(10,2) DEFAULT '0.00',
  `UnitCost` decimal(10,2) DEFAULT '0.00',
  `SalesPrice` decimal(18,2) DEFAULT '0.00',
  `CustomerSalesOrderID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;



CREATE TABLE `customersalesorderitems` (
  `CustomerSalesOrderItemID` int NOT NULL,
  `ItemID` int NOT NULL,
  `AllocatedQty` decimal(10,2) DEFAULT '0.00',
  `UnitCost` decimal(10,2) DEFAULT '0.00',
  `SalesPrice` decimal(18,2) DEFAULT '0.00',
  `CustomerSalesOrderID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `ItemID` int NOT NULL,
  `ProviderID` int NOT NULL,
  `SupplierID` int DEFAULT NULL,
  `Name` varchar(200) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Category` varchar(200) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Brand` varchar(200) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Status` tinyint DEFAULT NULL,
  `Description` varchar(500) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `ItemUnitID` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;



CREATE TABLE `items` (
  `ItemID` int NOT NULL,
  `ProviderID` int NOT NULL,
  `SupplierID` int DEFAULT NULL,
  `Name` varchar(200) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Category` varchar(200) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Brand` varchar(200) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Status` tinyint DEFAULT NULL,
  `Description` varchar(500) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `ItemUnitID` int DEFAULT NULL,
  `Stock` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;


-- --------------------------------------------------------

--
-- Table structure for table `itemsstock`
--

CREATE TABLE `itemsstock` (
  `ItemStockID` int NOT NULL,
  `ItemID` int NOT NULL,
  `PurchasePrice` decimal(10,2) DEFAULT '0.00',
  `ProviderID` int DEFAULT NULL,
  `PurchaseDate` datetime DEFAULT NULL,
  `Qty` decimal(10,2) DEFAULT NULL,
  `RemainingQty` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `itemunits`
--

CREATE TABLE `itemunits` (
  `ItemUnitID` int NOT NULL,
  `UnitName` varchar(45) COLLATE utf8mb3_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `PermissionID` int NOT NULL,
  `Name` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Description` varchar(300) COLLATE utf8mb3_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `providerpermissions`
--

CREATE TABLE `providerpermissions` (
  `ProviderPermissionID` int NOT NULL,
  `ProviderID` int NOT NULL,
  `PermissionID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `providerrolepermissions`
--

CREATE TABLE `providerrolepermissions` (
  `ProviderRolePermissionID` int NOT NULL,
  `RoleID` int DEFAULT NULL,
  `PermissionsID` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `providerroles`
--

CREATE TABLE `providerroles` (
  `RoleID` int NOT NULL,
  `ProviderID` int DEFAULT NULL,
  `RoleName` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `providers`
--

CREATE TABLE `providers` (
  `ProviderID` int NOT NULL,
  `Name` varchar(300) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Address` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Phone` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Email` varchar(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Status` tinyint DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `providerusers`
--

CREATE TABLE `providerusers` (
  `UserID` int NOT NULL,
  `ProviderID` int DEFAULT NULL,
  `RoleID` int DEFAULT NULL,
  `UserName` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `FirstName` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `LastName` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Email` varchar(250) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Password` varchar(200) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Status` tinyint DEFAULT '1',
  `Deleted` tinyint DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchaseorderitems`
--

CREATE TABLE `purchaseorderitems` (
  `PurchaseOrderItemID` int NOT NULL,
  `ItemID` int NOT NULL,
  `PurchaseQty` decimal(10,2) DEFAULT '0.00',
  `UnitCost` decimal(10,2) DEFAULT '0.00',
  `PurchasePrice` decimal(18,2) DEFAULT '0.00',
  `InvoiceNumber` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `InvoiceDate` datetime DEFAULT NULL,
  `PurchaseOrderID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchaseorders`
--

CREATE TABLE `purchaseorders` (
  `PurchaseOrderID` int NOT NULL,
  `CustomerSalesOrderID` int DEFAULT NULL,
  `CustomerID` int DEFAULT NULL,
  `ProviderID` int DEFAULT NULL,
  `PurchaseOrderNumber` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `PurchaseDate` datetime DEFAULT NULL,
  `Status` tinyint DEFAULT '1',
  `PurchaseTotalPrice` decimal(18,2) DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `SupplierID` int NOT NULL,
  `ProviderID` int NOT NULL,
  `Name` varchar(200) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Email` varchar(200) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Phone` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Status` tinyint DEFAULT NULL,
  `Address` varchar(200) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Area` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `City` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `State` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `GST` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `Id` int NOT NULL,
  `Username` varchar(200) COLLATE utf8mb3_unicode_ci NOT NULL,
  `name` varchar(200) COLLATE utf8mb3_unicode_ci NOT NULL,
  `email` varchar(256) COLLATE utf8mb3_unicode_ci NOT NULL,
  `passwordhash` varchar(1000) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `isadmin` bit(1) NOT NULL,
  `status` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`Id`, `Username`, `name`, `email`, `passwordhash`, `isadmin`, `status`) VALUES
(1, 'test', 'test', 'test@test.com', '', b'1', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`CustomerID`),
  ADD KEY `NonPrimary` (`ProviderID`,`Status`,`Name`);

--
-- Indexes for table `customersalesorder`
--
ALTER TABLE `customersalesorder`
  ADD PRIMARY KEY (`CustomerSalesOrderID`),
  ADD KEY `NonPrimary` (`CustomerID`,`ProviderID`,`SalesOrderNumber`,`Status`,`SalesDate`);

--
-- Indexes for table `customersalesorderitems`
--
ALTER TABLE `customersalesorderitems`
  ADD PRIMARY KEY (`CustomerSalesOrderItemID`),
  ADD KEY `NonPrimary` (`ItemID`,`CustomerSalesOrderID`) INVISIBLE;

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`ItemID`),
  ADD KEY `NonPrimary` (`ProviderID`,`Status`,`Name`,`SupplierID`);

--
-- Indexes for table `itemsstock`
--
ALTER TABLE `itemsstock`
  ADD PRIMARY KEY (`ItemStockID`),
  ADD KEY `NonPrimary` (`ItemID`,`ProviderID`,`PurchaseDate`) INVISIBLE;

--
-- Indexes for table `itemunits`
--
ALTER TABLE `itemunits`
  ADD PRIMARY KEY (`ItemUnitID`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`PermissionID`);

--
-- Indexes for table `providerpermissions`
--
ALTER TABLE `providerpermissions`
  ADD PRIMARY KEY (`ProviderPermissionID`),
  ADD KEY `Nonprimary` (`PermissionID`,`ProviderID`);

--
-- Indexes for table `providerrolepermissions`
--
ALTER TABLE `providerrolepermissions`
  ADD PRIMARY KEY (`ProviderRolePermissionID`),
  ADD KEY `NonPrimary` (`RoleID`);

--
-- Indexes for table `providerroles`
--
ALTER TABLE `providerroles`
  ADD PRIMARY KEY (`RoleID`),
  ADD KEY `NonPrimary` (`ProviderID`) INVISIBLE;

--
-- Indexes for table `providers`
--
ALTER TABLE `providers`
  ADD PRIMARY KEY (`ProviderID`);

--
-- Indexes for table `providerusers`
--
ALTER TABLE `providerusers`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `UserName_UNIQUE` (`UserName`,`ProviderID`) INVISIBLE,
  ADD KEY `NonPrimary` (`ProviderID`,`UserName`,`Deleted`,`Status`) INVISIBLE;

--
-- Indexes for table `purchaseorderitems`
--
ALTER TABLE `purchaseorderitems`
  ADD PRIMARY KEY (`PurchaseOrderItemID`),
  ADD KEY `NonPrimary` (`ItemID`,`PurchaseOrderID`) INVISIBLE;

--
-- Indexes for table `purchaseorders`
--
ALTER TABLE `purchaseorders`
  ADD PRIMARY KEY (`PurchaseOrderID`),
  ADD KEY `NonPrimary` (`CustomerID`,`ProviderID`,`CustomerSalesOrderID`,`PurchaseOrderNumber`,`Status`,`PurchaseDate`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`SupplierID`),
  ADD KEY `NonPrimary` (`ProviderID`,`Status`,`Name`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`Id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `CustomerID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `customersalesorder`
--
ALTER TABLE `customersalesorder`
  MODIFY `CustomerSalesOrderID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customersalesorderitems`
--
ALTER TABLE `customersalesorderitems`
  MODIFY `CustomerSalesOrderItemID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `ItemID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `itemsstock`
--
ALTER TABLE `itemsstock`
  MODIFY `ItemStockID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `itemunits`
--
ALTER TABLE `itemunits`
  MODIFY `ItemUnitID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `PermissionID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `providerpermissions`
--
ALTER TABLE `providerpermissions`
  MODIFY `ProviderPermissionID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `providerrolepermissions`
--
ALTER TABLE `providerrolepermissions`
  MODIFY `ProviderRolePermissionID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `providerroles`
--
ALTER TABLE `providerroles`
  MODIFY `RoleID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `providers`
--
ALTER TABLE `providers`
  MODIFY `ProviderID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `providerusers`
--
ALTER TABLE `providerusers`
  MODIFY `UserID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchaseorderitems`
--
ALTER TABLE `purchaseorderitems`
  MODIFY `PurchaseOrderItemID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchaseorders`
--
ALTER TABLE `purchaseorders`
  MODIFY `PurchaseOrderID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `SupplierID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;