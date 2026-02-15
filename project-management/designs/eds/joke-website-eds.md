# External Design Specification (EDS): Family-Friendly Joke Website

**Version**: 1.0  
**Date**: February 15, 2026  
**Architect**: Architect Agent  
**Related**: [EPS: joke-website-eps.md](../eps/joke-website-eps.md)  
**Status**: Ready for Development  

## Implementation Architecture

### System Components

```
Project Structure:
modules/
└── joke-website/
    ├── src/
    │   ├── server/          # Node.js Express backend
    │   │   ├── app.js       # Main application entry
    │   │   ├── routes/      # API route handlers
    │   │   ├── models/      # Data models and database
    │   │   ├── middleware/  # Content filtering and validation
    │   │   └── utils/       # Helper functions
    │   ├── public/          # Static frontend assets
    │   │   ├── css/         # Stylesheets
    │   │   ├── js/          # Client-side JavaScript
    │   │   ├── images/      # Static images and icons
    │   │   └── index.html   # Main HTML template
    │   └── data/            # Initial joke data and seed files
    ├── build-config/        # Build configuration
    └── test/                # Test files
```

## Database Design

### SQLite Schema

```sql
-- Categories table for joke organization
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    slug VARCHAR(50) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Main jokes table
CREATE TABLE jokes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  
    category_id INTEGER NOT NULL,
    setup TEXT NOT NULL,            -- Joke setup/question
    punchline TEXT,                -- Punchline (optional for riddles)
    content_type VARCHAR(20) DEFAULT 'standard', -- 'standard', 'knockknock', 'riddle'
    status VARCHAR(20) DEFAULT 'approved',       -- 'pending', 'approved', 'rejected'  
    rating_count INTEGER DEFAULT 0,
    positive_ratings INTEGER DEFAULT 0,
    negative_ratings INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    submitted_by VARCHAR(255),      -- Anonymous identifier or 'admin'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories (id)
);

-- Search optimization
CREATE INDEX idx_jokes_category ON jokes(category_id);
CREATE INDEX idx_jokes_status ON jokes(status);
CREATE INDEX idx_jokes_rating ON jokes(positive_ratings DESC);
CREATE VIRTUAL TABLE jokes_fts USING fts5(setup, punchline, content=jokes);

-- Moderation queue for user submissions
CREATE TABLE moderation_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    joke_id INTEGER NOT NULL,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    review_notes TEXT,
    reviewer_id VARCHAR(255),
    action_taken VARCHAR(20), -- 'approved', 'rejected', 'edited'
    FOREIGN KEY (joke_id) REFERENCES jokes (id)
);

-- Content filtering rules
CREATE TABLE filter_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rule_type VARCHAR(20) NOT NULL, -- 'forbidden_word', 'pattern', 'phrase'
    rule_value TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'moderate', -- 'low', 'moderate', 'high'
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Initial Data Seeding

```javascript
// Category seed data
const categories = [
    { name: 'Dad Jokes', description: 'Classic puns and wordplay', slug: 'dad-jokes' },
    { name: 'One-liners', description: 'Quick, punchy jokes', slug: 'one-liners' },
    { name: 'Knock-knock', description: 'Interactive question-answer format', slug: 'knockknock' },
    { name: 'Riddles', description: 'Brain teasers and puzzles', slug: 'riddles' },
    { name: 'Animal Jokes', description: 'Pet and wildlife humor', slug: 'animal-jokes' },
    { name: 'Tech Jokes', description: 'Programming and technology humor', slug: 'tech-jokes' }
];

// Sample PG-13 content filtering rules  
const filterRules = [
    { rule_type: 'forbidden_word', rule_value: 'inappropriate_word_1', severity: 'high' },
    { rule_type: 'pattern', rule_value: 'regex_pattern_for_bad_content', severity: 'moderate' }
];
```

## API Specification

### REST API Endpoints

```yaml
# Joke Retrieval APIs
GET /api/jokes/random              # Get random joke from all categories
GET /api/jokes/category/:slug      # Get jokes by category with pagination
GET /api/jokes/search?q=keyword    # Search jokes by keyword
GET /api/jokes/:id                 # Get specific joke by ID
GET /api/categories                # Get all categories with joke counts

# User Interaction APIs  
POST /api/jokes/:id/rate          # Rate a joke (thumbs up/down)
POST /api/jokes/submit            # Submit new joke for moderation

# Administrative APIs
GET /api/admin/moderation-queue   # Get pending submissions
POST /api/admin/moderate/:id      # Approve/reject submission
```

### API Response Formats

```typescript
// Joke object structure
interface Joke {
    id: number;
    setup: string;
    punchline?: string;
    contentType: 'standard' | 'knockknock' | 'riddle';
    category: {
        id: number;
        name: string;
        slug: string;
    };
    rating: {
        positive: number;
        negative: number;
        total: number;
    };
    isFeatured: boolean;
    createdAt: string;
}

// API Response wrapper
interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
```

## Frontend Architecture

### HTML Structure Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FamilyJokes - Clean Humor for Everyone</title>
    <link rel="stylesheet" href="/css/main.css">
    <link rel="stylesheet" href="/css/responsive.css">
</head>
<body>
    <!-- Navigation Header -->
    <header class="main-header">
        <nav class="category-nav">
            <h1 class="site-title">FamilyJokes</h1>
            <div class="category-buttons" id="categoryButtons">
                <!-- Dynamically populated -->
            </div>
        </nav>
        <div class="search-bar">
            <input type="text" id="searchInput" placeholder="Search for jokes...">
            <button id="searchButton">Search</button>
        </div>
    </header>

    <!-- Main Content Area -->
    <main class="joke-container">
        <div class="joke-display" id="jokeDisplay">
            <!-- Dynamic joke content -->
        </div>
        
        <div class="joke-controls">
            <button id="randomJokeBtn" class="control-btn">Random Joke</button>
            <div class="rating-buttons">
                <button id="thumbsUpBtn" class="rating-btn">👍</button>
                <button id="thumbsDownBtn" class="rating-btn">👎</button>
            </div>
            <div class="share-buttons">
                <button id="shareBtn" class="control-btn">Share</button>
                <button id="copyBtn" class="control-btn">Copy Link</button>
            </div>
        </div>
        
        <div class="pagination" id="pagination">
            <!-- Navigation buttons -->
        </div>
    </main>

    <!-- Joke Submission Modal -->
    <div class="modal" id="submitModal">
        <div class="modal-content">
            <form id="jokeSubmissionForm">
                <!-- Submission form fields -->
            </form>
        </div>
    </div>

    <script src="/js/main.js"></script>
</body>
</html>
```

### JavaScript Architecture

```javascript
// Main application class
class JokeWebsiteApp {
    constructor() {
        this.currentJoke = null;
        this.currentCategory = 'all';
        this.userRatings = JSON.parse(localStorage.getItem('userRatings') || '{}');
        this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        this.initializeEventListeners();
        this.loadRandomJoke();
    }

    // Core Methods
    async loadRandomJoke() { /* Implementation */ }
    async loadJokesByCategory(categorySlug) { /* Implementation */ }
    async searchJokes(query) { /* Implementation */ }
    async rateJoke(jokeId, isPositive) { /* Implementation */ }
    async submitJoke(jokeData) { /* Implementation */ }
    
    // UI Methods  
    displayJoke(joke) { /* Render joke in UI */ }
    updateCategoryButtons() { /* Update navigation */ }
    showSubmissionForm() { /* Modal display */ }
    shareJoke(joke) { /* Social sharing */ }
    
    // Utility Methods
    saveToLocalStorage(key, data) { /* Browser storage */ }
    showNotification(message) { /* User feedback */ }
}

// Initialize app when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    new JokeWebsiteApp();
});
```

## Backend Implementation

### Express.js Application Structure

```javascript
// app.js - Main application setup
const express = require('express');
const path = require('path');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const jokeRoutes = require('./routes/jokes');
const categoryRoutes = require('./routes/categories');
const adminRoutes = require('./routes/admin');
const contentFilter = require('./middleware/contentFilter');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Rate limiting for submissions
const submitLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5 // limit each IP to 5 submissions per windowMs
});

// Routes
app.use('/api/jokes', jokeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/jokes/submit', submitLimiter);

// Content filtering middleware
app.use('/api/jokes/submit', contentFilter.validateSubmission);

module.exports = app;
```

### Database Models

```javascript
// models/Joke.js
class Joke {
    constructor(database) {
        this.db = database;
    }

    async getRandomJoke() {
        const query = `
            SELECT j.*, c.name as category_name, c.slug as category_slug
            FROM jokes j 
            JOIN categories c ON j.category_id = c.id 
            WHERE j.status = 'approved' 
            ORDER BY RANDOM() 
            LIMIT 1
        `;
        return this.db.get(query);
    }

    async getJokesByCategory(categorySlug, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const query = `
            SELECT j.*, c.name as category_name, c.slug as category_slug
            FROM jokes j 
            JOIN categories c ON j.category_id = c.id 
            WHERE c.slug = ? AND j.status = 'approved'
            ORDER BY j.positive_ratings DESC, j.created_at DESC
            LIMIT ? OFFSET ?
        `;
        return this.db.all(query, [categorySlug, limit, offset]);
    }

    async searchJokes(searchTerm, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const query = `
            SELECT j.*, c.name as category_name, c.slug as category_slug,
                   snippet(jokes_fts) as snippet
            FROM jokes_fts 
            JOIN jokes j ON jokes_fts.rowid = j.id
            JOIN categories c ON j.category_id = c.id
            WHERE jokes_fts MATCH ? AND j.status = 'approved'
            ORDER BY rank
            LIMIT ? OFFSET ?
        `;
        return this.db.all(query, [searchTerm, limit, offset]);
    }
}

module.exports = Joke;
```

### Content Filtering System

```javascript
// middleware/contentFilter.js
class ContentFilter {
    constructor(database) {
        this.db = database;
        this.forbiddenWords = new Set();
        this.loadFilterRules();
    }

    async loadFilterRules() {
        const rules = await this.db.all(
            'SELECT * FROM filter_rules WHERE is_active = 1'
        );
        
        rules.forEach(rule => {
            if (rule.rule_type === 'forbidden_word') {
                this.forbiddenWords.add(rule.rule_value.toLowerCase());
            }
        });
    }

    validateSubmission(req, res, next) {
        const { setup, punchline } = req.body;
        const content = `${setup} ${punchline || ''}`.toLowerCase();

        // Check forbidden words
        for (const word of this.forbiddenWords) {
            if (content.includes(word)) {
                return res.status(400).json({
                    success: false,
                    message: 'Content contains inappropriate language for family-friendly site'
                });
            }
        }

        // Additional PG-13 validation rules
        if (this.containsInappropriateContent(content)) {
            return res.status(400).json({
                success: false,
                message: 'Content not suitable for PG-13 audience'
            });
        }

        next();
    }

    containsInappropriateContent(content) {
        // Custom validation logic for PG-13 rating
        const inappropriatePatterns = [
            /alcohol|drugs|smoking/i,
            /violence|weapons|fighting/i,
            /adult themes|mature content/i
        ];

        return inappropriatePatterns.some(pattern => pattern.test(content));
    }
}

module.exports = ContentFilter;
```

## Build Configuration

### Package.json Dependencies

```json
{
    "name": "family-jokes-website",
    "version": "1.0.0", 
    "description": "Family-friendly joke website with PG-13 content",
    "main": "src/server/app.js",
    "scripts": {
        "start": "node src/server/app.js",
        "dev": "nodemon src/server/app.js", 
        "build": "npm run build:css && npm run build:js",
        "build:css": "concat-cli -f src/public/css/*.css -o build/main.css",
        "build:js": "browserify src/public/js/main.js -o build/bundle.js",
        "test": "jest",
        "seed": "node src/utils/seedDatabase.js"
    },
    "dependencies": {
        "express": "^4.18.2",
        "sqlite3": "^5.1.6",
        "cors": "^2.8.5", 
        "express-rate-limit": "^6.7.0",
        "helmet": "^6.1.5"
    },
    "devDependencies": {
        "nodemon": "^2.0.22",
        "jest": "^29.5.0",
        "concat-cli": "^4.0.0",
        "browserify": "^17.0.0"
    }
}
```

### Environment Configuration

```bash
# .env file for configuration
NODE_ENV=development
PORT=3000
DB_PATH=./src/data/jokes.db
ADMIN_PASSWORD=secure_admin_password_123
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5
```

## Deployment Specifications

### Production Requirements
- **Node.js**: Version 18.x or higher
- **Memory**: Minimum 512MB RAM
- **Storage**: 100MB for application + database growth
- **Network**: Standard HTTP/HTTPS (ports 80/443)

### Development Setup
1. Clone repository and navigate to module directory
2. Run `npm install` to install dependencies  
3. Run `npm run seed` to populate database with initial jokes
4. Run `npm run dev` for development server with auto-reload
5. Access application at `http://localhost:3000`

---

**EDS Status**: ✅ **Complete and Ready for Implementation**  
**Next Phase**: IT Agent setup of development environment  
**Estimated Development Time**: 8-12 hours across Developer and Tester agents