USE master;
GO

-- Crear base de datos
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'ArcadeX')
    CREATE DATABASE ArcadeX;
GO


-- Usar base de datos
USE ArcadeX;
GO 

-- =========================
-- Tabla: Developers
-- =========================
CREATE TABLE Developers (
    id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(100) NOT NULL,
    country NVARCHAR(100),
    website NVARCHAR(255)
);
GO 

-- =========================
-- Tabla: Developers
-- =========================
CREATE TABLE Editores (
    id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(100) NOT NULL
);
GO

-- =========================
-- Tabla: Users
-- =========================
CREATE TABLE Users (
    id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    username NVARCHAR(50) UNIQUE NOT NULL,
    email NVARCHAR(100) UNIQUE NOT NULL,
    passwordhash NVARCHAR(255) NOT NULL,
    country NVARCHAR(100),
    createdat DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    lastlogin DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO 

-- =========================
-- Tabla: Games
-- =========================
CREATE TABLE Games (
    id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    title NVARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) DEFAULT 0,
    releasedate DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    developerid UNIQUEIDENTIFIER NOT NULL,
    publisherid INT,

    FOREIGN KEY (developerid) REFERENCES Developers(id)
);
GO 

-- =========================
-- Tabla: Games Sessions
-- =========================
CREATE TABLE GameSessions (
    id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    usuarioid UNIQUEIDENTIFIER NOT NULL,
    gameid UNIQUEIDENTIFIER NOT NULL,
    starttime DATETIME2,
    endtime DATETIME2,

    FOREIGN KEY (usuarioid) REFERENCES Users(id),
    FOREIGN KEY (gameid) REFERENCES Games(id)
);
GO

-- =========================
-- Tabla: Geners
-- =========================
CREATE TABLE Geners (
    id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    descripcion NVARCHAR(50) NOT NULL
);
GO


-- =========================
-- Tabla: GenersGames
-- =========================
CREATE TABLE GenerGame (
    gameid UNIQUEIDENTIFIER NOT NULL,
    generid UNIQUEIDENTIFIER NOT NULL,

    PRIMARY KEY (gameid, generid),

    FOREIGN KEY (gameid) REFERENCES Games(id),
    FOREIGN KEY (generid) REFERENCES Geners(id)
);
GO


-- =========================
-- Tabla: User_Games 
-- =========================
CREATE TABLE UserGames(
    userid UNIQUEIDENTIFIER NOT NULL,
    gameid UNIQUEIDENTIFIER NOT NULL,
    purchasedate DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    playtimehours INT DEFAULT 0,

	PRIMARY KEY (userid, gameid),

    FOREIGN KEY (userid) REFERENCES Users(id),
    FOREIGN KEY (gameid) REFERENCES Games(id)
);
GO 

-- =========================
-- Tabla: Friends
-- =========================
CREATE TABLE Friends (
    userid UNIQUEIDENTIFIER NOT NULL,
    friendid UNIQUEIDENTIFIER NOT NULL,
    status NVARCHAR(20),
    createdat DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),

    PRIMARY KEY (userid, friendid),

    FOREIGN KEY (userid) REFERENCES Users(id),
    FOREIGN KEY (friendid) REFERENCES Users(id)
);
GO 

-- =========================
-- Tabla: Achievements
-- =========================
CREATE TABLE Achievements (
    id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    gameid UNIQUEIDENTIFIER NOT NULL,
    title NVARCHAR(150),
    description TEXT,

    FOREIGN KEY (gameid) REFERENCES Games(id)
);
GO 

-- =========================
-- Tabla: User Achievements
-- =========================
CREATE TABLE UserAchievements (
    userid UNIQUEIDENTIFIER NOT NULL,
    achievementid UNIQUEIDENTIFIER NOT NULL,
    unlockedat DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),

    PRIMARY KEY (userid, achievementid),

    FOREIGN KEY (userid) REFERENCES Users(id),
    FOREIGN KEY (achievementid) REFERENCES Achievements(id)
);
GO 

-- =========================
-- Tabla: Reviews
-- =========================
CREATE TABLE Reviews (
    id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    userid UNIQUEIDENTIFIER NOT NULL,
    gameid UNIQUEIDENTIFIER NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    createdat DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),

	CONSTRAINT UQ_User_Game UNIQUE (userid, gameid),

    FOREIGN KEY (userid) REFERENCES Users(id),
    FOREIGN KEY (gameid) REFERENCES Games(id)
);
GO 

-- =========================================
-- Tabla: Review_Comments
-- =========================================
CREATE TABLE ReviewComments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    reviewid UNIQUEIDENTIFIER NOT NULL,
    userid UNIQUEIDENTIFIER NOT NULL,
    comment TEXT,
    createdat DATETIME2 DEFAULT SYSDATETIME(),

    FOREIGN KEY (reviewid) REFERENCES Reviews(id),
    FOREIGN KEY (userid) REFERENCES Users(id)
);
GO


-- =========================================
-- WISHLIST
-- =========================================
CREATE TABLE Wishlist (
    userid UNIQUEIDENTIFIER NOT NULL,
    gameid UNIQUEIDENTIFIER NOT NULL,

    PRIMARY KEY (userid, gameid),

    FOREIGN KEY (userid) REFERENCES Users(id),
    FOREIGN KEY (gameid) REFERENCES Games(id)
);
GO

-- =========================================
-- OFFERS
-- =========================================
CREATE TABLE Offers (
    offerid INT IDENTITY(1,1) PRIMARY KEY,
    gameid UNIQUEIDENTIFIER NOT NULL,
    discountpct DECIMAL(5,2),
    startdate DATETIME2,
    enddate DATETIME2,

    FOREIGN KEY (gameid) REFERENCES Games(id)
);
GO

-- =========================
-- Inserts
-- =========================

-- 1️ Developers
DECLARE @PRIMERDEVELOPER UNIQUEIDENTIFIER = NEWID();
INSERT INTO Developers (id, name, country, website)
VALUES (@PRIMERDEVELOPER,'Valve', 'USA', 'https://www.valvesoftware.com');
-- 2️ Otro Developer
DECLARE @SEGUNDODEVELOPER UNIQUEIDENTIFIER = NEWID();
INSERT INTO Developers (id, name, country, website)
VALUES (@SEGUNDODEVELOPER, 'Rockstar Games', 'USA', 'https://www.rockstargames.com');


-- 5️ Game
DECLARE @PRIMERGAME UNIQUEIDENTIFIER = NEWID();
INSERT INTO Games (id,title, description, price, releasedate, developerid)
VALUES (@PRIMERGAME,'Counter Strike Clone', 'Shooter competitivo', 0.00, '2023-09-01', @PRIMERDEVELOPER);
-- 6️ Otro Game
DECLARE @SEGUNDOGAME UNIQUEIDENTIFIER = NEWID();
INSERT INTO Games (id, title, description, price, releasedate, developerid)
VALUES (@SEGUNDOGAME, 'Open World Crime', 'Juego de mundo abierto', 59.99, '2020-05-10', @SEGUNDODEVELOPER);


-- 3️ Users
DECLARE @PRIMERUSER UNIQUEIDENTIFIER = NEWID();
INSERT INTO Users (id, username, email, passwordhash, country)
VALUES (@PRIMERUSER, 'player1', 'player1@email.com', 'hash123', 'Ecuador');
-- 4️ Otro User
DECLARE @SEGUNDOUSER UNIQUEIDENTIFIER = NEWID();
INSERT INTO Users (id, username, email, passwordhash, country)
VALUES (@SEGUNDOUSER, 'player2', 'player2@email.com', 'hash456', 'Colombia');


-- 7️ User Games (player1 compra juego 1)
INSERT INTO UserGames (userid, gameid, playtimehours)
VALUES (@PRIMERUSER, @PRIMERGAME, 120);


-- 8️ Friends
INSERT INTO Friends (userid, friendid, status)
VALUES (@PRIMERUSER, @SEGUNDOUSER, 'accepted');


-- 9️ Achievement
INSERT INTO Achievements (gameid, title, description)
VALUES (@PRIMERGAME, 'First Win', 'Ganar tu primera partida');


-- 10 Review
INSERT INTO Reviews (userid, gameid, rating, comment)
VALUES (@PRIMERUSER, @PRIMERGAME, 5, 'Excelente juego!');
GO