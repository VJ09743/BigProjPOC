-- Joke Web Application Database Schema
-- SQLite 3 with FTS5 for search functionality
-- Version: 1.0

PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

-- =============================================================================
-- Categories Table
-- =============================================================================
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color_hex VARCHAR(7) DEFAULT '#3B82F6',
    icon_name VARCHAR(50) DEFAULT 'smile',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for categories
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active_sort ON categories(is_active, sort_order);

-- =============================================================================
-- Jokes Table
-- =============================================================================
CREATE TABLE IF NOT EXISTS jokes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    setup TEXT NOT NULL,
    punchline TEXT NOT NULL,
    content_rating VARCHAR(10) DEFAULT 'PG' CHECK (content_rating IN ('G', 'PG', 'PG-13')),
    source VARCHAR(100) DEFAULT 'manual',
    is_approved BOOLEAN DEFAULT 1,
    is_featured BOOLEAN DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    rating_sum INTEGER DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_jokes_category ON jokes(category_id);
CREATE INDEX IF NOT EXISTS idx_jokes_approved ON jokes(is_approved);
CREATE INDEX IF NOT EXISTS idx_jokes_featured ON jokes(is_featured);
CREATE INDEX IF NOT EXISTS idx_jokes_rating ON jokes(rating_sum, rating_count);
CREATE INDEX IF NOT EXISTS idx_jokes_content_rating ON jokes(content_rating);

-- =============================================================================
-- Full-Text Search Table 
-- =============================================================================
CREATE VIRTUAL TABLE IF NOT EXISTS jokes_fts USING fts5(
    joke_id,
    setup,
    punchline,
    tokenize = porter
);

-- =============================================================================
-- User Sessions Table (for tracking preferences/ratings)
-- =============================================================================
CREATE TABLE IF NOT EXISTS user_sessions (
    id TEXT PRIMARY KEY, -- UUID v4
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_active DATETIME DEFAULT CURRENT_TIMESTAMP,
    preferences TEXT DEFAULT '{}' -- JSON blob for user preferences
);

CREATE INDEX IF NOT EXISTS idx_sessions_active ON user_sessions(last_active);

-- =============================================================================
-- User Ratings Table
-- =============================================================================
CREATE TABLE IF NOT EXISTS user_ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    joke_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (session_id) REFERENCES user_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (joke_id) REFERENCES jokes(id) ON DELETE CASCADE,
    
    UNIQUE(session_id, joke_id) -- One rating per user per joke
);

CREATE INDEX IF NOT EXISTS idx_ratings_session ON user_ratings(session_id);
CREATE INDEX IF NOT EXISTS idx_ratings_joke ON user_ratings(joke_id);

-- =============================================================================
-- User Favorites Table
-- =============================================================================
CREATE TABLE IF NOT EXISTS user_favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    joke_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (session_id) REFERENCES user_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (joke_id) REFERENCES jokes(id) ON DELETE CASCADE,
    
    UNIQUE(session_id, joke_id) -- One favorite per user per joke
);

CREATE INDEX IF NOT EXISTS idx_favorites_session ON user_favorites(session_id);
CREATE INDEX IF NOT EXISTS idx_favorites_joke ON user_favorites(joke_id);

-- =============================================================================
-- Triggers for maintaining data integrity
-- =============================================================================

-- Update jokes search index when jokes are inserted/updated
DROP TRIGGER IF EXISTS jokes_fts_insert;
CREATE TRIGGER jokes_fts_insert AFTER INSERT ON jokes
BEGIN
    INSERT INTO jokes_fts(joke_id, setup, punchline) 
    VALUES (NEW.id, NEW.setup, NEW.punchline);
END;

DROP TRIGGER IF EXISTS jokes_fts_update;
CREATE TRIGGER jokes_fts_update AFTER UPDATE ON jokes
BEGIN
    UPDATE jokes_fts 
    SET setup = NEW.setup, punchline = NEW.punchline
    WHERE joke_id = NEW.id;
END;

DROP TRIGGER IF EXISTS jokes_fts_delete;
CREATE TRIGGER jokes_fts_delete AFTER DELETE ON jokes
BEGIN
    DELETE FROM jokes_fts WHERE joke_id = OLD.id;
END;

-- Update rating statistics when user ratings change
DROP TRIGGER IF EXISTS update_rating_stats_insert;
CREATE TRIGGER update_rating_stats_insert AFTER INSERT ON user_ratings
BEGIN
    UPDATE jokes 
    SET rating_sum = rating_sum + NEW.rating,
        rating_count = rating_count + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.joke_id;
END;

DROP TRIGGER IF EXISTS update_rating_stats_update;
CREATE TRIGGER update_rating_stats_update AFTER UPDATE ON user_ratings
BEGIN
    UPDATE jokes 
    SET rating_sum = rating_sum - OLD.rating + NEW.rating,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.joke_id;
END;

DROP TRIGGER IF EXISTS update_rating_stats_delete;
CREATE TRIGGER update_rating_stats_delete AFTER DELETE ON user_ratings
BEGIN
    UPDATE jokes 
    SET rating_sum = rating_sum - OLD.rating,
        rating_count = rating_count - 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.joke_id;
END;

-- =============================================================================
-- Views for common queries
-- =============================================================================

-- Jokes with category info and average rating
DROP VIEW IF EXISTS jokes_with_details;
CREATE VIEW jokes_with_details AS
SELECT 
    j.id,
    j.setup,
    j.punchline,
    j.content_rating,
    j.is_featured,
    j.view_count,
    CASE 
        WHEN j.rating_count > 0 THEN ROUND(CAST(j.rating_sum AS FLOAT) / j.rating_count, 2)
        ELSE 0 
    END as avg_rating,
    j.rating_count,
    j.created_at,
    c.name as category_name,
    c.slug as category_slug,
    c.color_hex as category_color,
    c.icon_name as category_icon
FROM jokes j
JOIN categories c ON j.category_id = c.id
WHERE j.is_approved = 1 AND c.is_active = 1;

-- Popular jokes (high ratings and views)
DROP VIEW IF EXISTS popular_jokes;
CREATE VIEW popular_jokes AS
SELECT * FROM jokes_with_details
WHERE rating_count >= 5 AND avg_rating >= 4.0
ORDER BY avg_rating DESC, rating_count DESC, view_count DESC;