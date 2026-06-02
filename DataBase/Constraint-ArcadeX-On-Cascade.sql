-- =====================================================================
-- ArcadeX - Aplicar ON DELETE CASCADE sobre una BD EXISTENTE
-- =====================================================================
-- Este script NO borra la base de datos ni los datos.
-- Solo elimina las FKs actuales (sin nombre) y las recrea con nombre
-- propio + las reglas de cascada.
--
-- ANTES DE EJECUTAR EN PRODUCCION:
--   1. Haz un BACKUP de la base de datos.
--   2. Ejecutalo idealmente en una ventana de mantenimiento.
--   3. Esta envuelto en una transaccion: si algo falla, hace ROLLBACK.
-- =====================================================================

USE ArcadeX;
GO

BEGIN TRANSACTION;
GO

-- ---------------------------------------------------------------------
-- 1. ELIMINAR TODAS LAS FKs ACTUALES (tienen nombres autogenerados)
-- ---------------------------------------------------------------------
DECLARE @dropSql NVARCHAR(MAX) = N'';

SELECT @dropSql += 'ALTER TABLE '
    + QUOTENAME(SCHEMA_NAME(t.schema_id)) + '.' + QUOTENAME(t.name)
    + ' DROP CONSTRAINT ' + QUOTENAME(fk.name) + ';' + CHAR(10)
FROM sys.foreign_keys fk
JOIN sys.tables t ON fk.parent_object_id = t.object_id;

EXEC sp_executesql @dropSql;
GO

-- ---------------------------------------------------------------------
-- 2. RECREAR LAS FKs CON NOMBRE + REGLAS DE CASCADA
-- ---------------------------------------------------------------------

-- USER ROLES
ALTER TABLE UserRoles
    ADD CONSTRAINT FK_UserRoles_Users
    FOREIGN KEY (userid) REFERENCES Users(id) ON DELETE CASCADE;

ALTER TABLE UserRoles
    ADD CONSTRAINT FK_UserRoles_Roles
    FOREIGN KEY (roleid) REFERENCES Roles(id) ON DELETE CASCADE;

-- GAMES  (ownerid -> NO ACTION intencional)
ALTER TABLE Games
    ADD CONSTRAINT FK_Games_Users
    FOREIGN KEY (ownerid) REFERENCES Users(id);

-- GAME SESSIONS
ALTER TABLE GameSessions
    ADD CONSTRAINT FK_GameSessions_Users
    FOREIGN KEY (userid) REFERENCES Users(id) ON DELETE CASCADE;

ALTER TABLE GameSessions
    ADD CONSTRAINT FK_GameSessions_Games
    FOREIGN KEY (gameid) REFERENCES Games(id) ON DELETE CASCADE;

-- GAME GENRES
ALTER TABLE GameGenres
    ADD CONSTRAINT FK_GameGenres_Games
    FOREIGN KEY (gameid) REFERENCES Games(id) ON DELETE CASCADE;

ALTER TABLE GameGenres
    ADD CONSTRAINT FK_GameGenres_Genres
    FOREIGN KEY (genreid) REFERENCES Genres(id) ON DELETE CASCADE;

-- USER GAMES
ALTER TABLE UserGames
    ADD CONSTRAINT FK_UserGames_Users
    FOREIGN KEY (userid) REFERENCES Users(id) ON DELETE CASCADE;

ALTER TABLE UserGames
    ADD CONSTRAINT FK_UserGames_Games
    FOREIGN KEY (gameid) REFERENCES Games(id) ON DELETE CASCADE;

-- FRIENDS  (friendid -> NO ACTION intencional, segunda FK hacia Users)
ALTER TABLE Friends
    ADD CONSTRAINT FK_Friends_Users
    FOREIGN KEY (userid) REFERENCES Users(id) ON DELETE CASCADE;

ALTER TABLE Friends
    ADD CONSTRAINT FK_Friends_FriendUser
    FOREIGN KEY (friendid) REFERENCES Users(id);

-- ACHIEVEMENTS
ALTER TABLE Achievements
    ADD CONSTRAINT FK_Achievements_Games
    FOREIGN KEY (gameid) REFERENCES Games(id) ON DELETE CASCADE;

-- USER ACHIEVEMENTS
ALTER TABLE UserAchievements
    ADD CONSTRAINT FK_UserAchievements_Users
    FOREIGN KEY (userid) REFERENCES Users(id) ON DELETE CASCADE;

ALTER TABLE UserAchievements
    ADD CONSTRAINT FK_UserAchievements_Achievements
    FOREIGN KEY (achievementid) REFERENCES Achievements(id) ON DELETE CASCADE;

-- REVIEWS
ALTER TABLE Reviews
    ADD CONSTRAINT FK_Reviews_Users
    FOREIGN KEY (userid) REFERENCES Users(id) ON DELETE CASCADE;

ALTER TABLE Reviews
    ADD CONSTRAINT FK_Reviews_Games
    FOREIGN KEY (gameid) REFERENCES Games(id) ON DELETE CASCADE;

-- REVIEW COMMENTS  (userid -> NO ACTION intencional)
ALTER TABLE ReviewComments
    ADD CONSTRAINT FK_ReviewComments_Reviews
    FOREIGN KEY (reviewid) REFERENCES Reviews(id) ON DELETE CASCADE;

ALTER TABLE ReviewComments
    ADD CONSTRAINT FK_ReviewComments_Users
    FOREIGN KEY (userid) REFERENCES Users(id);

-- WISHLIST
ALTER TABLE Wishlist
    ADD CONSTRAINT FK_Wishlist_Users
    FOREIGN KEY (userid) REFERENCES Users(id) ON DELETE CASCADE;

ALTER TABLE Wishlist
    ADD CONSTRAINT FK_Wishlist_Games
    FOREIGN KEY (gameid) REFERENCES Games(id) ON DELETE CASCADE;

-- OFFERS
ALTER TABLE Offers
    ADD CONSTRAINT FK_Offers_Games
    FOREIGN KEY (gameid) REFERENCES Games(id) ON DELETE CASCADE;
GO

COMMIT TRANSACTION;
GO

-- ---------------------------------------------------------------------
-- 3. VERIFICACION: lista las FKs y su regla de borrado
-- ---------------------------------------------------------------------
SELECT
    fk.name                         AS Constraint_Name,
    OBJECT_NAME(fk.parent_object_id) AS Tabla,
    fk.delete_referential_action_desc AS Regla_Delete
FROM sys.foreign_keys fk
ORDER BY Tabla, Constraint_Name;
GO