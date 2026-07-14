-- database/users.sql
-- Table pour stocker les utilisateurs authentifiés via OAuth2

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    oauth_provider VARCHAR(50) NOT NULL COMMENT 'Provider OAuth (google, github)',
    oauth_id VARCHAR(255) NOT NULL COMMENT 'ID unique du provider',
    email VARCHAR(255) NULL,
    display_name VARCHAR(255) NOT NULL,
    avatar_url TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    UNIQUE KEY unique_oauth (oauth_provider, oauth_id),
    INDEX idx_email (email),
    INDEX idx_provider (oauth_provider)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Exemple de requête pour ajouter last_login lors de la connexion
-- UPDATE users SET last_login = NOW() WHERE id = ?;
