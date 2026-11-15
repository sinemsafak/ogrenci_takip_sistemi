-- Öğrenci bilgi sistemi veritabanı 
--Veri tabanı oluşturma 
CREATE DATABASE IF NOT EXISTS ogrenci_bilgi_sistemi;
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;

-- veritabanını seçmek için 
-- IF NOT EXISTS ifadesi mevcut veritabanı ve tabloyu korur
CREATE TABLE IF NOT EXISTS users(      
    -- her kullanıcı için otomatik oluşturulan benzersiz bir id için 
    id INT AUTO_INCREMENT PRİMARY KEY,

    -- kullanıcı adı sütünu için 
    username VARCHAR(50) NOT NULL, 

    -- e posta adresinin benzersiz olmaı için 
    email VARCHAR(255) NOT NULL UNIQUE,

    -- bcrypt ile hashlenmiş şifreyi saklamak için 
    password VARCHAR(255) NOT NULL,
);

