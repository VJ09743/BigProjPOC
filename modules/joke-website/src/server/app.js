const express = require('express');
const path = require('path');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Import models and middleware
const Database = require('./models/Database');
const Joke = require('./models/Joke');
const Category = require('./models/Category');
const ContentFilter = require('./middleware/contentFilter');

// Import route creators
const createJokesRouter = require('./routes/jokes');
const createCategoriesRouter = require('./routes/categories');
const createAdminRouter = require('./routes/admin');

class JokeWebsiteApp {
    constructor() {
        this.app = express();
        this.database = null;
        this.jokeModel = null;
        this.categoryModel = null;
        this.contentFilter = null;
        this.port = process.env.PORT || 3000;
    }

    async init() {
        try {
            // Initialize database
            this.database = new Database();
            await this.database.init();

            // Initialize models
            this.jokeModel = new Joke(this.database);
            this.categoryModel = new Category(this.database);
            this.contentFilter = new ContentFilter(this.database);

            // Setup middleware
            this.setupMiddleware();

            // Setup routes
            this.setupRoutes();

            // Setup error handling
            this.setupErrorHandling();

            console.log('FamilyJokes app initialized successfully');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            process.exit(1);
        }
    }

    setupMiddleware() {
        // Security headers
        this.app.use(helmet());

        // CORS
        this.app.use(cors());

        // Body parsing
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        // Static files
        this.app.use(express.static(path.join(__dirname, '../public')));

        // Rate limiting for submissions
        const submitLimiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 5, // limit each IP to 5 submissions per windowMs
            message: {
                success: false,
                message: 'Too many joke submissions, please try again later'
            },
            standardHeaders: true,
            legacyHeaders: false
        });

        // Apply rate limiting to submission endpoints
        this.app.use('/api/jokes/submit', submitLimiter);

        // Logging middleware
        this.app.use((req, res, next) => {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
            next();
        });
    }

    setupRoutes() {
        // API routes
        this.app.use('/api/jokes', createJokesRouter(this.jokeModel, this.contentFilter));
        this.app.use('/api/categories', createCategoriesRouter(this.categoryModel));
        this.app.use('/api/admin', createAdminRouter(this.jokeModel));

        // Root route - serve main HTML
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '../public/index.html'));
        });

        // Health check endpoint
        this.app.get('/health', (req, res) => {
            res.json({
                success: true,
                message: 'FamilyJokes server is running',
                timestamp: new Date().toISOString()
            });
        });

        // Catch-all route for SPA-like behavior
        this.app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../public/index.html'));
        });
    }

    setupErrorHandling() {
        // 404 handler for API routes
        this.app.use('/api/*', (req, res) => {
            res.status(404).json({
                success: false,
                message: 'API endpoint not found'
            });
        });

        // Global error handler
        this.app.use((err, req, res, next) => {
            console.error('Unhandled error:', err);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        });
    }

    async start() {
        this.app.listen(this.port, () => {
            console.log(`🎉 FamilyJokes website running on http://localhost:${this.port}`);
            console.log('✅ Family-friendly joke website ready!');
            console.log('📚 API endpoints available:');
            console.log('   GET  /api/jokes/random');
            console.log('   GET  /api/jokes/category/:slug');
            console.log('   GET  /api/jokes/search?q=keyword');
            console.log('   POST /api/jokes/submit');
            console.log('   GET  /api/categories');
        });
    }

    async shutdown() {
        if (this.database) {
            this.database.close();
        }
    }
}

// Application entry point
if (require.main === module) {
    const app = new JokeWebsiteApp();
    
    app.init().then(() => {
        return app.start();
    }).catch(error => {
        console.error('Failed to start application:', error);
        process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
        console.log('\nShutting down gracefully...');
        await app.shutdown();
        process.exit(0);
    });
}

module.exports = JokeWebsiteApp;