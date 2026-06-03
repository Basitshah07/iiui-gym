-- ============================================
--  FILE: gym_database.sql
--  PURPOSE: Database Setup for IIUI Gym
--  HOW TO USE: Open phpMyAdmin, create database
--  named iiui_gym, then import this file
-- ============================================

CREATE DATABASE IF NOT EXISTS iiui_gym;
USE iiui_gym;

-- ----------------------------
-- Table 1: Members
-- ----------------------------
CREATE TABLE members (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    full_name   VARCHAR(100) NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    phone       VARCHAR(20)  NOT NULL,
    plan        ENUM('basic','standard','premium') DEFAULT 'basic',
    joined_date DATE         NOT NULL,
    expiry_date DATE         NOT NULL,
    status      ENUM('active','expired') DEFAULT 'active',
    password    VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------
-- Table 2: Admin Login
-- ----------------------------
CREATE TABLE admins (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50)  NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- ----------------------------
-- Table 3: Contact Messages
-- ----------------------------
CREATE TABLE contacts (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(100) NOT NULL,
    message    TEXT         NOT NULL,
    sent_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------
-- Default Admin Account
-- Username: admin | Password: admin123
-- ----------------------------
INSERT INTO admins (username, password)
VALUES ('admin', MD5('admin123'));

-- ----------------------------
-- Sample Members (for testing)
-- ----------------------------
INSERT INTO members (full_name, email, phone, plan, joined_date, expiry_date, status, password) VALUES
('Ali Hassan',  'ali@example.com',  '0300-1234567', 'premium',  '2026-04-01', '2026-05-01', 'active',  MD5('ali123')),
('Sara Khan',   'sara@example.com', '0301-9876543', 'standard', '2026-04-15', '2026-05-15', 'active',  MD5('sara123')),
('Umar Farooq', 'umar@example.com', '0302-5556677', 'basic',    '2026-05-01', '2026-06-01', 'active',  MD5('umar123'));