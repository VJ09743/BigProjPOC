#!/usr/bin/env ts-node

import dotenv from 'dotenv';
import DatabaseService from './database/DatabaseService';
import { seedDatabase } from './database/seedData';

// Load environment variables
dotenv.config();

async function main() {
    try {
        console.log('🚀 Joke App Database Seeder');
        console.log('==========================');

        // Initialize database
        const dbService = DatabaseService.getInstance();
        await dbService.initialize();
        await dbService.initializeSchema();

        // Seed the database
        await seedDatabase();

        console.log('🎉 Seeding complete!');
        
        // Close database connection
        await dbService.close();
        process.exit(0);

    } catch (error) {
        console.error('💥 Seeding failed:', error);
        process.exit(1);
    }
}

// Run the seeder
main();