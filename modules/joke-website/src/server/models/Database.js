const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
    constructor(dbPath = './src/data/jokes.db') {
        this.dbPath = dbPath;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Connected to SQLite database');
                    this.createTables().then(resolve).catch(reject);
                }
            });
        });
    }

    async createTables() {
        const queries = [
            // Categories table for joke organization
            `CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(50) NOT NULL UNIQUE,
                description TEXT,
                slug VARCHAR(50) NOT NULL UNIQUE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,

            // Main jokes table
            `CREATE TABLE IF NOT EXISTS jokes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,  
                category_id INTEGER NOT NULL,
                setup TEXT NOT NULL,
                punchline TEXT,
                content_type VARCHAR(20) DEFAULT 'standard',
                status VARCHAR(20) DEFAULT 'approved', 
                rating_count INTEGER DEFAULT 0,
                positive_ratings INTEGER DEFAULT 0,
                negative_ratings INTEGER DEFAULT 0,
                is_featured BOOLEAN DEFAULT FALSE,
                submitted_by VARCHAR(255), 
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories (id)
            )`,

            // Search optimization indexes
            `CREATE INDEX IF NOT EXISTS idx_jokes_category ON jokes(category_id)`,
            `CREATE INDEX IF NOT EXISTS idx_jokes_status ON jokes(status)`,
            `CREATE INDEX IF NOT EXISTS idx_jokes_rating ON jokes(positive_ratings DESC)`,

            // Full-text search virtual table
            `CREATE VIRTUAL TABLE IF NOT EXISTS jokes_fts USING fts5(setup, punchline, content=jokes)`,

            // Moderation queue for user submissions
            `CREATE TABLE IF NOT EXISTS moderation_queue (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                joke_id INTEGER NOT NULL,
                submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                review_notes TEXT,
                reviewer_id VARCHAR(255),
                action_taken VARCHAR(20),
                FOREIGN KEY (joke_id) REFERENCES jokes (id)
            )`,

            // Content filtering rules
            `CREATE TABLE IF NOT EXISTS filter_rules (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                rule_type VARCHAR(20) NOT NULL,
                rule_value TEXT NOT NULL,
                severity VARCHAR(20) DEFAULT 'moderate',
                is_active BOOLEAN DEFAULT TRUE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`
        ];

        for (const query of queries) {
            await this.run(query);
        }

        console.log('Database tables created successfully');
    }

    async run(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(query, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, changes: this.changes });
                }
            });
        });
    }

    async get(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(query, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    async all(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(query, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    close() {
        if (this.db) {
            this.db.close();
        }
    }
}

module.exports = Database;