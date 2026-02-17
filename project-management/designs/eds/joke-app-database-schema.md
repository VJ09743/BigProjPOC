# Database Schema Design - Joke Web Application

## Database Overview

**Database Type**: SQLite 3.x  
**Schema Version**: 1.0  
**Character Encoding**: UTF-8  
**Features Used**: Full-text search (FTS5), foreign keys, triggers, indexes

## Schema Design Principles

1. **Normalization**: 3NF to reduce redundancy while maintaining query performance
2. **Indexing Strategy**: Optimized for search performance and frequent queries
3. **Content Integrity**: Constraints and triggers to maintain data consistency
4. **Performance**: Designed for <50ms query response times
5. **Extensibility**: Schema allows future enhancements without major changes

## Core Tables

### 1. Categories Table
```sql
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color_hex VARCHAR(7) DEFAULT '#3B82F6', -- Blue theme
    icon_name VARCHAR(50) DEFAULT 'smile',   -- Icon identifier
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active_sort ON categories(is_active, sort_order);
```

**Sample Data**:
```sql  
INSERT INTO categories (name, slug, description, color_hex, icon_name, sort_order) VALUES
('Dad Jokes', 'dad-jokes', 'Classic groan-worthy dad humor', '#8B5CF6', 'user-tie', 1),
('Puns', 'puns', 'Clever wordplay and puns', '#10B981', 'lightbulb', 2),
('One-Liners', 'one-liners', 'Quick wit in one sentence', '#F59E0B', 'zap', 3),
('Animal Jokes', 'animal-jokes', 'Funny stories about animals', '#EF4444', 'dog', 4),
('Food Jokes', 'food-jokes', 'Culinary comedy', '#F97316', 'pizza', 5),
('School Jokes', 'school-jokes', 'Educational entertainment', '#06B6D4', 'book', 6),
('Technology Jokes', 'tech-jokes', 'Geeky and nerdy humor', '#6366F1', 'computer', 7),
('Sports Jokes', 'sports-jokes', 'Athletic and competitive humor', '#84CC16', 'trophy', 8);
```

### 2. Jokes Table  
```sql
CREATE TABLE jokes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    setup TEXT NOT NULL,              -- Joke setup/question (for Q&A format)
    punchline TEXT NOT NULL,          -- Joke punchline/answer
    content TEXT GENERATED ALWAYS AS (setup || ' ' || punchline) VIRTUAL, -- For search
    content_rating VARCHAR(10) DEFAULT 'PG' CHECK (content_rating IN ('G', 'PG', 'PG-13')),
    source VARCHAR(100) DEFAULT 'manual', -- 'manual', 'api', 'user_submission'
    external_id VARCHAR(100),         -- ID from external joke API
    is_approved BOOLEAN DEFAULT 1,    -- For content moderation
    is_featured BOOLEAN DEFAULT 0,    -- For highlighting popular jokes
    view_count INTEGER DEFAULT 0,     -- Usage analytics
    rating_sum INTEGER DEFAULT 0,     -- Sum of all ratings (for avg calculation)
    rating_count INTEGER DEFAULT 0,   -- Number of ratings received
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- Indexes for performance
CREATE INDEX idx_jokes_category ON jokes(category_id);
CREATE INDEX idx_jokes_approved ON jokes(is_approved);
CREATE INDEX idx_jokes_featured ON jokes(is_featured);
CREATE INDEX idx_jokes_rating ON jokes(rating_sum, rating_count);
CREATE INDEX idx_jokes_source ON jokes(source);
CREATE INDEX idx_jokes_external_id ON jokes(external_id);

-- Full-text search index (FTS5 for advanced search)
CREATE VIRTUAL TABLE jokes_fts USING fts5(
    setup,
    punchline,
    content='jokes',
    content_rowid='id'
);

-- Triggers to maintain FTS index
CREATE TRIGGER jokes_fts_insert AFTER INSERT ON jokes BEGIN
    INSERT INTO jokes_fts(rowid, setup, punchline) VALUES (new.id, new.setup, new.punchline);
END;

CREATE TRIGGER jokes_fts_delete AFTER DELETE ON jokes BEGIN
    INSERT INTO jokes_fts(jokes_fts, rowid, setup, punchline) VALUES('delete', old.id, old.setup, old.punchline);
END;

CREATE TRIGGER jokes_fts_update AFTER UPDATE ON jokes BEGIN
    INSERT INTO jokes_fts(jokes_fts, rowid, setup, punchline) VALUES('delete', old.id, old.setup, old.punchline);
    INSERT INTO jokes_fts(rowid, setup, punchline) VALUES (new.id, new.setup, new.punchline);
END;
```

### 3. User Data Table (Browser-based, anonymous)
```sql
CREATE TABLE user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id VARCHAR(36) NOT NULL UNIQUE,  -- UUID generated in browser
    preferences TEXT,                        -- JSON string of user preferences
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_active DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_sessions_id ON user_sessions(session_id);
CREATE INDEX idx_user_sessions_active ON user_sessions(last_active);
```

### 4. Ratings Table
```sql
CREATE TABLE ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    joke_id INTEGER NOT NULL,
    session_id VARCHAR(36) NOT NULL,   -- Links to browser session
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (joke_id) REFERENCES jokes(id) ON DELETE CASCADE,
    UNIQUE(joke_id, session_id)  -- One rating per joke per user session
);

CREATE INDEX idx_ratings_joke ON ratings(joke_id);
CREATE INDEX idx_ratings_session ON ratings(session_id);

-- Trigger to update joke rating aggregates
CREATE TRIGGER update_joke_ratings AFTER INSERT ON ratings BEGIN
    UPDATE jokes 
    SET rating_sum = (SELECT COALESCE(SUM(rating), 0) FROM ratings WHERE joke_id = NEW.joke_id),
        rating_count = (SELECT COUNT(*) FROM ratings WHERE joke_id = NEW.joke_id),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.joke_id;
END;

CREATE TRIGGER update_joke_ratings_delete AFTER DELETE ON ratings BEGIN
    UPDATE jokes 
    SET rating_sum = (SELECT COALESCE(SUM(rating), 0) FROM ratings WHERE joke_id = OLD.joke_id),
        rating_count = (SELECT COUNT(*) FROM ratings WHERE joke_id = OLD.joke_id),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.joke_id;
END;
```

### 5. Favorites Table
```sql
CREATE TABLE favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    joke_id INTEGER NOT NULL,
    session_id VARCHAR(36) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (joke_id) REFERENCES jokes(id) ON DELETE CASCADE,
    UNIQUE(joke_id, session_id)  -- One favorite per joke per user session
);

CREATE INDEX idx_favorites_joke ON favorites(joke_id);
CREATE INDEX idx_favorites_session ON favorites(session_id);
```

### 6. Submissions Table (User-submitted jokes)
```sql
CREATE TABLE submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    setup TEXT NOT NULL,
    punchline TEXT NOT NULL,
    submitter_session VARCHAR(36) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    moderation_notes TEXT,
    moderated_by VARCHAR(100),           -- For future admin system
    moderated_at DATETIME,
    approved_joke_id INTEGER,            -- Link to jokes table if approved
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (approved_joke_id) REFERENCES jokes(id) ON DELETE SET NULL
);

CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_category ON submissions(category_id);
CREATE INDEX idx_submissions_session ON submissions(submitter_session);
```

## Views for Common Queries

### 1. Jokes with Category Info
```sql
CREATE VIEW v_jokes_with_category AS
SELECT 
    j.id,
    j.setup,
    j.punchline,  
    j.content_rating,
    j.is_featured,
    j.view_count,
    CASE 
        WHEN j.rating_count > 0 THEN ROUND(CAST(j.rating_sum AS REAL) / j.rating_count, 2)
        ELSE 0 
    END AS avg_rating,
    j.rating_count,
    j.created_at,
    c.name AS category_name,
    c.slug AS category_slug,
    c.color_hex AS category_color,
    c.icon_name AS category_icon
FROM jokes j
JOIN categories c ON j.category_id = c.id
WHERE j.is_approved = 1 AND c.is_active = 1;
```

### 2. Popular Jokes
```sql
CREATE VIEW v_popular_jokes AS
SELECT *,
    (view_count * 0.3 + rating_sum * 0.7) AS popularity_score
FROM v_jokes_with_category
WHERE rating_count >= 3  -- Minimum ratings for reliability
ORDER BY popularity_score DESC;
```

### 3. User Favorites with Details
```sql
CREATE VIEW v_user_favorites AS
SELECT 
    f.session_id,
    f.created_at AS favorited_at,
    j.*
FROM favorites f
JOIN v_jokes_with_category j ON f.joke_id = j.id
ORDER BY f.created_at DESC;
```

## Performance Optimization

### Query Performance Targets
- **Search queries**: <100ms
- **Random joke selection**: <50ms  
- **Category browse**: <75ms
- **Rating updates**: <25ms
- **Favorites operations**: <25ms

### Indexing Strategy
```sql
-- Composite indexes for common query patterns
CREATE INDEX idx_jokes_category_rating ON jokes(category_id, rating_sum DESC, rating_count);
CREATE INDEX idx_jokes_approved_featured ON jokes(is_approved, is_featured, created_at DESC);

-- Full-text search optimization
CREATE INDEX idx_jokes_fts_category ON jokes(category_id) WHERE is_approved = 1;
```

### Database Optimization Settings
```sql  
-- SQLite performance pragmas
PRAGMA journal_mode = WAL;           -- Write-Ahead Logging for better concurrency
PRAGMA cache_size = 10000;           -- 10MB cache for faster queries  
PRAGMA synchronous = NORMAL;         -- Balance safety vs performance
PRAGMA foreign_keys = ON;            -- Enforce referential integrity
PRAGMA temp_store = memory;          -- Keep temp tables in memory
PRAGMA mmap_size = 268435456;        -- 256MB memory mapping
```

## Content Management Features

### Content Moderation Workflow
1. User submits joke → `submissions` table (status: 'pending')
2. Automated content filter checks PG-13 compliance
3. Manual review updates status to 'approved' or 'rejected'  
4. Approved jokes copied to `jokes` table with `source = 'user_submission'`

### Data Integrity Triggers
```sql  
-- Prevent deletion of categories with active jokes
CREATE TRIGGER prevent_category_delete BEFORE DELETE ON categories BEGIN
    SELECT CASE 
        WHEN (SELECT COUNT(*) FROM jokes WHERE category_id = OLD.id) > 0 THEN
            RAISE(ABORT, 'Cannot delete category with existing jokes')
    END;
END;

-- Auto-update timestamps
CREATE TRIGGER update_joke_timestamp BEFORE UPDATE ON jokes BEGIN
    UPDATE jokes SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
```

## Migration & Seeding Strategy

### Database Setup Script
```sql
-- Create all tables in dependency order
-- Insert default categories  
-- Load initial joke dataset (1000+ jokes)
-- Create indexes and views
-- Set up triggers
-- Configure performance settings
```

### Seed Data Requirements
- **8 joke categories** with distinct themes and colors
- **1000+ pre-approved jokes** distributed across categories
- **Proper content rating** for all jokes (G, PG, PG-13)
- **Full-text search optimization** after bulk insert

---

**Document Status**: Complete  
**Created by**: Architect Agent  
**Date**: 2026-02-17  
**Performance Target**: All queries <100ms  
**Next Phase**: API Specification Design