USE master;
GO

-- =========================================
-- RESET DATABASE
-- =========================================

IF EXISTS (SELECT name FROM sys.databases WHERE name = 'ArcadeX')
BEGIN
    ALTER DATABASE ArcadeX
    SET SINGLE_USER
    WITH ROLLBACK IMMEDIATE;

    DROP DATABASE ArcadeX;
END
GO

CREATE DATABASE ArcadeX;
GO

USE ArcadeX;
GO

-- =========================================
-- USERS
-- =========================================

CREATE TABLE Users (
    id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),

    username NVARCHAR(50) NOT NULL UNIQUE,

    email NVARCHAR(100) NOT NULL UNIQUE,

    passwordhash NVARCHAR(255) NOT NULL,

    country NVARCHAR(100),

    createdat DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),

    lastlogin DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- =========================================
-- ROLES
-- =========================================

CREATE TABLE Roles (
    id INT IDENTITY(1,1) PRIMARY KEY,

    name NVARCHAR(50) NOT NULL UNIQUE
);
GO

-- =========================================
-- USER ROLES
-- =========================================

CREATE TABLE UserRoles (
    userid UNIQUEIDENTIFIER NOT NULL,

    roleid INT NOT NULL,

    PRIMARY KEY(userid, roleid),

    FOREIGN KEY(userid)
        REFERENCES Users(id),

    FOREIGN KEY(roleid)
        REFERENCES Roles(id)
);
GO

-- =========================================
-- GAMES
-- =========================================

CREATE TABLE Games (
    id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),

    title NVARCHAR(150) NOT NULL,

    description NVARCHAR(MAX),

    price DECIMAL(10,2)
        CHECK (price >= 0)
        DEFAULT 0,

    releasedate DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),

    ownerid UNIQUEIDENTIFIER NOT NULL,

    FOREIGN KEY (ownerid)
        REFERENCES Users(id)
);
GO

-- =========================================
-- GAME SESSIONS
-- =========================================

CREATE TABLE GameSessions (
    id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),

    userid UNIQUEIDENTIFIER NOT NULL,

    gameid UNIQUEIDENTIFIER NOT NULL,

    starttime DATETIME2,

    endtime DATETIME2,

    CHECK (endtime >= starttime),

    FOREIGN KEY (userid)
        REFERENCES Users(id),

    FOREIGN KEY (gameid)
        REFERENCES Games(id)
);
GO

-- =========================================
-- GENRES
-- =========================================

CREATE TABLE Genres (
    id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),

    name NVARCHAR(50) NOT NULL UNIQUE
);
GO

-- =========================================
-- GAME GENRES
-- =========================================

CREATE TABLE GameGenres (
    gameid UNIQUEIDENTIFIER NOT NULL,

    genreid UNIQUEIDENTIFIER NOT NULL,

    PRIMARY KEY (gameid, genreid),

    FOREIGN KEY (gameid)
        REFERENCES Games(id),

    FOREIGN KEY (genreid)
        REFERENCES Genres(id)
);
GO

-- =========================================
-- USER GAMES
-- =========================================

CREATE TABLE UserGames (
    userid UNIQUEIDENTIFIER NOT NULL,

    gameid UNIQUEIDENTIFIER NOT NULL,

    purchasedate DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),

    playtimeminutes INT DEFAULT 0,

    PRIMARY KEY (userid, gameid),

    FOREIGN KEY (userid)
        REFERENCES Users(id),

    FOREIGN KEY (gameid)
        REFERENCES Games(id)
);
GO

-- =========================================
-- FRIENDS
-- =========================================

CREATE TABLE Friends (
    userid UNIQUEIDENTIFIER NOT NULL,

    friendid UNIQUEIDENTIFIER NOT NULL,

    status NVARCHAR(20)
        CHECK (status IN ('pending', 'accepted', 'blocked')),

    createdat DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),

    PRIMARY KEY (userid, friendid),

    FOREIGN KEY (userid)
        REFERENCES Users(id),

    FOREIGN KEY (friendid)
        REFERENCES Users(id)
);
GO

-- =========================================
-- ACHIEVEMENTS
-- =========================================

CREATE TABLE Achievements (
    id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),

    gameid UNIQUEIDENTIFIER NOT NULL,

    title NVARCHAR(150),

    description NVARCHAR(MAX),

    FOREIGN KEY (gameid)
        REFERENCES Games(id)
);
GO

-- =========================================
-- USER ACHIEVEMENTS
-- =========================================

CREATE TABLE UserAchievements (
    userid UNIQUEIDENTIFIER NOT NULL,

    achievementid UNIQUEIDENTIFIER NOT NULL,

    unlockedat DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),

    PRIMARY KEY (userid, achievementid),

    FOREIGN KEY (userid)
        REFERENCES Users(id),

    FOREIGN KEY (achievementid)
        REFERENCES Achievements(id)
);
GO

-- =========================================
-- REVIEWS
-- =========================================

CREATE TABLE Reviews (
    id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),

    userid UNIQUEIDENTIFIER NOT NULL,

    gameid UNIQUEIDENTIFIER NOT NULL,

    rating INT
        CHECK (rating BETWEEN 1 AND 5),

    comment NVARCHAR(MAX),

    createdat DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT UQ_User_Game UNIQUE (userid, gameid),

    FOREIGN KEY (userid)
        REFERENCES Users(id),

    FOREIGN KEY (gameid)
        REFERENCES Games(id)
);
GO

-- =========================================
-- REVIEW COMMENTS
-- =========================================

CREATE TABLE ReviewComments (
    id INT IDENTITY(1,1) PRIMARY KEY,

    reviewid UNIQUEIDENTIFIER NOT NULL,

    userid UNIQUEIDENTIFIER NOT NULL,

    comment NVARCHAR(MAX),

    createdat DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),

    FOREIGN KEY (reviewid)
        REFERENCES Reviews(id),

    FOREIGN KEY (userid)
        REFERENCES Users(id)
);
GO

-- =========================================
-- WISHLIST
-- =========================================

CREATE TABLE Wishlist (
    userid UNIQUEIDENTIFIER NOT NULL,

    gameid UNIQUEIDENTIFIER NOT NULL,

    addedat DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),

    PRIMARY KEY (userid, gameid),

    FOREIGN KEY (userid)
        REFERENCES Users(id),

    FOREIGN KEY (gameid)
        REFERENCES Games(id)
);
GO

-- =========================================
-- OFFERS
-- =========================================

CREATE TABLE Offers (
    offerid INT IDENTITY(1,1) PRIMARY KEY,

    gameid UNIQUEIDENTIFIER NOT NULL,

    discountpct DECIMAL(5,2)
        CHECK (discountpct BETWEEN 0 AND 100),

    startdate DATETIME2,

    enddate DATETIME2,

    FOREIGN KEY (gameid)
        REFERENCES Games(id)
);
GO

-- =========================================
-- INSERTS
-- =========================================

-- USERS
DECLARE @ADMINUSER UNIQUEIDENTIFIER = NEWID();
DECLARE @DEVELOPERUSER UNIQUEIDENTIFIER = NEWID();
DECLARE @NORMALUSER UNIQUEIDENTIFIER = NEWID();

INSERT INTO Users (
    id,
    username,
    email,
    passwordhash,
    country
)
VALUES
(
    @ADMINUSER,
    'admin',
    'admin@arcadex.com',
    'hash_admin',
    'Ecuador'
),
(
    @DEVELOPERUSER,
    'valve_dev',
    'dev@valve.com',
    'hash_dev',
    'USA'
),
(
    @NORMALUSER,
    'player1',
    'player1@email.com',
    'hash_player',
    'Colombia'
);

-- ROLES
INSERT INTO Roles (name)
VALUES
('Admin'),
('User'),
('Developer'),
('Publisher');

-- USER ROLES
DECLARE @ADMINROLE INT;
DECLARE @USERROLE INT;
DECLARE @DEVELOPERROLE INT;
DECLARE @PUBLISHERROLE INT;

SELECT @ADMINROLE = id
FROM Roles
WHERE name = 'Admin';

SELECT @USERROLE = id
FROM Roles
WHERE name = 'User';

SELECT @DEVELOPERROLE = id
FROM Roles
WHERE name = 'Developer';

SELECT @PUBLISHERROLE = id
FROM Roles
WHERE name = 'Publisher';

INSERT INTO UserRoles (
    userid,
    roleid
)
VALUES
(@ADMINUSER, @ADMINROLE),
(@DEVELOPERUSER, @DEVELOPERROLE),
(@DEVELOPERUSER, @PUBLISHERROLE),
(@NORMALUSER, @USERROLE);

-- GAMES
DECLARE @FIRSTGAME UNIQUEIDENTIFIER = NEWID();

INSERT INTO Games (
    id,
    title,
    description,
    price,
    releasedate,
    ownerid
)
VALUES
(
    @FIRSTGAME,
    'Counter Strike Clone',
    'Competitive shooter game',
    0.00,
    '2023-09-01',
    @DEVELOPERUSER
);

-- GENRES
DECLARE @ACTIONGENRE UNIQUEIDENTIFIER = NEWID();
DECLARE @SHOOTERGENRE UNIQUEIDENTIFIER = NEWID();

INSERT INTO Genres (
    id,
    name
)
VALUES
(
    @ACTIONGENRE,
    'Action'
),
(
    @SHOOTERGENRE,
    'Shooter'
);

-- GAME GENRES
INSERT INTO GameGenres (
    gameid,
    genreid
)
VALUES
(
    @FIRSTGAME,
    @ACTIONGENRE
),
(
    @FIRSTGAME,
    @SHOOTERGENRE
);

-- USER GAMES
INSERT INTO UserGames (
    userid,
    gameid,
    playtimeminutes
)
VALUES
(
    @NORMALUSER,
    @FIRSTGAME,
    7200
);

-- FRIENDS
INSERT INTO Friends (
    userid,
    friendid,
    status
)
VALUES
(
    @NORMALUSER,
    @DEVELOPERUSER,
    'accepted'
);

-- ACHIEVEMENTS
DECLARE @FIRSTACHIEVEMENT UNIQUEIDENTIFIER = NEWID();

INSERT INTO Achievements (
    id,
    gameid,
    title,
    description
)
VALUES
(
    @FIRSTACHIEVEMENT,
    @FIRSTGAME,
    'First Victory',
    'Win your first match'
);

-- USER ACHIEVEMENTS
INSERT INTO UserAchievements (
    userid,
    achievementid
)
VALUES
(
    @NORMALUSER,
    @FIRSTACHIEVEMENT
);

-- REVIEWS
DECLARE @FIRSTREVIEW UNIQUEIDENTIFIER = NEWID();

INSERT INTO Reviews (
    id,
    userid,
    gameid,
    rating,
    comment
)
VALUES
(
    @FIRSTREVIEW,
    @NORMALUSER,
    @FIRSTGAME,
    5,
    'Excellent game!'
);

-- REVIEW COMMENTS
INSERT INTO ReviewComments (
    reviewid,
    userid,
    comment
)
VALUES
(
    @FIRSTREVIEW,
    @DEVELOPERUSER,
    'Thanks for playing!'
);

-- WISHLIST
INSERT INTO Wishlist (
    userid,
    gameid
)
VALUES
(
    @NORMALUSER,
    @FIRSTGAME
);

-- OFFERS
INSERT INTO Offers (
    gameid,
    discountpct,
    startdate,
    enddate
)
VALUES
(
    @FIRSTGAME,
    50,
    '2026-01-01',
    '2026-01-15'
);
GO