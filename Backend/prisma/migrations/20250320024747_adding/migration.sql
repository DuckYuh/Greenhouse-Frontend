/*
  Warnings:

  - You are about to drop the `device` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `record` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `record` DROP FOREIGN KEY `record_deviceID_fkey`;

-- DropTable
DROP TABLE `device`;

-- DropTable
DROP TABLE `record`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `User` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `username` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Device` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `maxValue` INTEGER NULL,
    `type` VARCHAR(191) NOT NULL,
    `topic` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Device_topic_key`(`topic`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Record` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `value` INTEGER NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL,
    `deviceID` INTEGER NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Record` ADD CONSTRAINT `Record_deviceID_fkey` FOREIGN KEY (`deviceID`) REFERENCES `Device`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;
