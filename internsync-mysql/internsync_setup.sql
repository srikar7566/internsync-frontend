-- =============================================================
--  InternSync Database Setup Script
--  Run this in MySQL Workbench or the MySQL CLI:
--    mysql -u root -p < internsync_setup.sql
-- =============================================================

-- 1. Create the database
CREATE DATABASE IF NOT EXISTS internsync_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE internsync_db;

-- =============================================================
-- 2. USERS table
--    Stores both admin and student accounts
-- =============================================================
CREATE TABLE IF NOT EXISTS users (
    id       BIGINT       NOT NULL AUTO_INCREMENT,
    name     VARCHAR(100) NOT NULL,
    email    VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role     VARCHAR(20)  NOT NULL DEFAULT 'student',  -- 'admin' | 'student'
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================
-- 3. INTERNSHIPS table
--    Created by admins; students can apply to open ones
-- =============================================================
CREATE TABLE IF NOT EXISTS internships (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    title       VARCHAR(200) NOT NULL,
    company     VARCHAR(150) NOT NULL,
    description TEXT,
    status      VARCHAR(20)  NOT NULL DEFAULT 'open',  -- 'open' | 'closed'
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================
-- 4. APPLICATIONS table
--    Records which student applied to which internship
-- =============================================================
CREATE TABLE IF NOT EXISTS applications (
    id             BIGINT      NOT NULL AUTO_INCREMENT,
    student_id     BIGINT      NOT NULL,
    internship_id  BIGINT      NOT NULL,
    status         VARCHAR(20) NOT NULL DEFAULT 'pending',  -- 'pending' | 'approved' | 'rejected'
    PRIMARY KEY (id),
    FOREIGN KEY (student_id)    REFERENCES users(id)        ON DELETE CASCADE,
    FOREIGN KEY (internship_id) REFERENCES internships(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================
-- 5. TASKS table
--    Admins assign tasks to approved students
-- =============================================================
CREATE TABLE IF NOT EXISTS tasks (
    id             BIGINT      NOT NULL AUTO_INCREMENT,
    title          VARCHAR(200) NOT NULL,
    description    TEXT,
    student_id     BIGINT      NOT NULL,
    internship_id  BIGINT      NOT NULL,
    status         VARCHAR(20) NOT NULL DEFAULT 'todo',  -- 'todo' | 'in-progress' | 'done'
    report         TEXT,
    PRIMARY KEY (id),
    FOREIGN KEY (student_id)    REFERENCES users(id)       ON DELETE CASCADE,
    FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================
-- 6. FEEDBACKS table
--    Admins give ratings/remarks to approved students
-- =============================================================
CREATE TABLE IF NOT EXISTS feedbacks (
    id             BIGINT      NOT NULL AUTO_INCREMENT,
    student_id     BIGINT      NOT NULL,
    internship_id  BIGINT      NOT NULL,
    rating         INT         NOT NULL CHECK (rating BETWEEN 1 AND 5),
    remarks        TEXT,
    PRIMARY KEY (id),
    FOREIGN KEY (student_id)    REFERENCES users(id)       ON DELETE CASCADE,
    FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================
-- 7. Optional: Seed one admin account for first login
--    Email: admin@internsync.com  |  Password: admin123
--    (Change this before going to production!)
-- =============================================================
INSERT IGNORE INTO users (name, email, password, role)
VALUES ('Admin', 'admin@internsync.com', 'admin123', 'admin');

-- Done!
SELECT 'InternSync database setup complete.' AS status;
