import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import { readFileSync } from 'fs';
import { join } from 'path';

// Enable verbose mode in development
if (process.env.NODE_ENV === 'development') {
    sqlite3.verbose();
}

class DatabaseService {
    private static instance: DatabaseService;
    private db: Database | null = null;

    private constructor() {}

    public static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    public async initialize(): Promise<Database> {
        if (this.db) {
            return this.db;
        }

        try {
            // Open SQLite database
            this.db = await open({
                filename: process.env.DB_PATH || join(__dirname, '../../../joke_app.db'),
                driver: sqlite3.Database
            });

            // Enable foreign keys and WAL mode
            await this.db.exec('PRAGMA foreign_keys = ON');
            await this.db.exec('PRAGMA journal_mode = WAL');

            console.log('✅ Database connected successfully');
            return this.db;
        } catch (error) {
            console.error('❌ Database connection failed:', error);
            throw error;
        }
    }

    public async initializeSchema(): Promise<void> {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        try {
            // Read and execute schema
            const schemaPath = join(__dirname, 'schema.sql');
            const schema = readFileSync(schemaPath, 'utf8');
            
            await this.db.exec(schema);
            console.log('✅ Database schema initialized');
        } catch (error) {
            console.error('❌ Schema initialization failed:', error);
            throw error;
        }
    }

    public getDb(): Database {
        if (!this.db) {
            throw new Error('Database not initialized. Call initialize() first.');
        }
        return this.db;
    }

    public async close(): Promise<void> {
        if (this.db) {
            await this.db.close();
            this.db = null;
            console.log('✅ Database connection closed');
        }
    }

    // Health check query
    public async healthCheck(): Promise<boolean> {
        try {
            if (!this.db) return false;
            await this.db.get('SELECT 1 as health');
            return true;
        } catch (error) {
            console.error('Database health check failed:', error);
            return false;
        }
    }
}

export default DatabaseService;