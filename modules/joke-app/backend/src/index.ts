import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { join } from 'path';
import DatabaseService from './database/DatabaseService';
import categoriesRouter from './routes/categories';
import jokesRouter from './routes/jokes';
import searchRouter from './routes/search';
import { ApiResponse } from './types';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// =============================================================================
// Middleware Setup
// =============================================================================

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// =============================================================================
// Routes
// =============================================================================

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        const dbService = DatabaseService.getInstance();
        const isHealthy = await dbService.healthCheck();
        
        const response: ApiResponse = {
            success: true,
            data: {
                status: 'healthy',
                database: isHealthy ? 'connected' : 'disconnected',
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV || 'development',
                version: '1.0.0'
            },
            timestamp: new Date().toISOString()
        };
        
        res.json(response);
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(503).json({
            success: false,
            error: {
                code: 'HEALTH_CHECK_FAILED',
                message: 'Health check failed'
            },
            timestamp: new Date().toISOString()
        });
    }
});

// Mount API route modules
app.use('/api/categories', categoriesRouter);
app.use('/api/jokes', jokesRouter);
app.use('/api/search', searchRouter);

// API root endpoint
app.get('/api', (req, res) => {
    const response: ApiResponse = {
        success: true,
        data: {
            name: 'Joke API',
            version: '1.0.0',
            description: 'REST API for browsing and searching jokes',
            endpoints: {
                categories: '/api/categories',
                jokes: '/api/jokes',
                search: '/api/search',
                health: '/health'
            },
            documentation: 'Built with Express.js + TypeScript + SQLite'
        },
        timestamp: new Date().toISOString()
    };
    
    res.json(response);
});

// =============================================================================
// Error Handling Middleware
// =============================================================================

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: `Route ${req.method} ${req.path} not found`
        },
        timestamp: new Date().toISOString()
    });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    
    res.status(err.status || 500).json({
        success: false,
        error: {
            code: err.code || 'INTERNAL_SERVER_ERROR',
            message: err.message || 'An unexpected error occurred'
        },
        timestamp: new Date().toISOString()
    });
});

// =============================================================================
// Server Initialization
// =============================================================================

async function startServer() {
    try {
        // Initialize database
        const dbService = DatabaseService.getInstance();
        await dbService.initialize();
        await dbService.initializeSchema();
        
        console.log('✅ Database initialized successfully');

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Joke App API server running on http://localhost:${PORT}`);
            console.log(`📚 Health check: http://localhost:${PORT}/health`);
            console.log(`🎭 API Base URL: http://localhost:${PORT}/api`);
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Handle graceful shutdown
async function gracefulShutdown(signal: string) {
    console.log(`\n⚠️ Received ${signal}. Starting graceful shutdown...`);
    
    try {
        const dbService = DatabaseService.getInstance();
        await dbService.close();
        console.log('✅ Server shutdown complete');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
    }
}

// Register shutdown handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start the server
startServer();

export default app;