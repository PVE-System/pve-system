ALTER TABLE users
ADD COLUMN resetToken VARCHAR(256) DEFAULT NULL,
ADD COLUMN resetTokenExpiration TIMESTAMP DEFAULT NULL;