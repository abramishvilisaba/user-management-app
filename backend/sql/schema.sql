
CREATE DATABASE users_app;
USE users_app;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    last_login_time DATETIME,
    registration_time DATETIME NOT NULL,
    status ENUM('active', 'blocked') NOT NULL
);