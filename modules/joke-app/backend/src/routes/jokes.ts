import { Router, Request, Response, NextFunction } from 'express';
import DatabaseService from '../database/DatabaseService';
import { ApiResponse, JokeQueryParams, CreateRatingRequest, CreateFavoriteRequest } from '../types';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// =============================================================================
// Jokes Endpoints
// =============================================================================

/**
 * GET /api/jokes
 * Get paginated jokes with filtering and sorting
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            page = 1,
            limit = 20,
            category,
            rating,
            featured,
            search,
            sort = 'newest'
        } = req.query as JokeQueryParams;

        const dbService = DatabaseService.getInstance();
        const db = dbService.getDb();

        // Build WHERE clause
        let whereClause = 'WHERE 1=1';
        const params: any[] = [];

        if (category) {
            whereClause += ' AND category_slug = ?';
            params.push(category);
        }

        if (rating) {
            whereClause += ' AND avg_rating >= ?';
            params.push(Number(rating));
        }

        if (featured !== undefined) {
            whereClause += ' AND is_featured = ?';
            params.push(featured ? 1 : 0);
        }

        // Build ORDER BY clause
        let orderClause = 'ORDER BY created_at DESC';
        switch (sort) {
            case 'oldest':
                orderClause = 'ORDER BY created_at ASC';
                break;
            case 'rating':
                orderClause = 'ORDER BY avg_rating DESC, rating_count DESC';
                break;
            case 'popular':
                orderClause = 'ORDER BY view_count DESC, avg_rating DESC';
                break;
            case 'random':
                orderClause = 'ORDER BY RANDOM()';
                break;
            default:
                orderClause = 'ORDER BY created_at DESC';
        }

        // Get paginated jokes
        const offset = (Number(page) - 1) * Number(limit);
        const jokes = await db.all(`
            SELECT * FROM jokes_with_details
            ${whereClause}
            ${orderClause}
            LIMIT ? OFFSET ?
        `, [...params, limit, offset]);

        // Get total count
        const totalResult = await db.get(`
            SELECT COUNT(*) as total FROM jokes_with_details
            ${whereClause}
        `, params);

        const response: ApiResponse = {
            success: true,
            data: jokes,
            meta: {
                page: Number(page),
                limit: Number(limit),
                total: totalResult.total,
                totalPages: Math.ceil(totalResult.total / Number(limit))
            },
            timestamp: new Date().toISOString()
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/jokes/random
 * Get a random joke, optionally filtered by category
 */
router.get('/random', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { category } = req.query;

        const dbService = DatabaseService.getInstance();
        const db = dbService.getDb();

        let whereClause = 'WHERE 1=1';
        const params: any[] = [];

        if (category) {
            whereClause += ' AND category_slug = ?';
            params.push(category);
        }

        const joke = await db.get(`
            SELECT * FROM jokes_with_details
            ${whereClause}
            ORDER BY RANDOM()
            LIMIT 1
        `, params);

        if (!joke) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'NO_JOKES_FOUND',
                    message: 'No jokes found matching criteria'
                },
                timestamp: new Date().toISOString()
            });
        }

        // Increment view count
        await db.run('UPDATE jokes SET view_count = view_count + 1 WHERE id = ?', [joke.id]);

        const response: ApiResponse = {
            success: true,
            data: joke,
            timestamp: new Date().toISOString()
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/jokes/:id
 * Get a specific joke by ID
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const dbService = DatabaseService.getInstance();
        const db = dbService.getDb();

        const joke = await db.get('SELECT * FROM jokes_with_details WHERE id = ?', [id]);

        if (!joke) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'JOKE_NOT_FOUND',
                    message: 'Joke not found'
                },
                timestamp: new Date().toISOString()
            });
        }

        // Increment view count
        await db.run('UPDATE jokes SET view_count = view_count + 1 WHERE id = ?', [id]);

        const response: ApiResponse = {
            success: true,
            data: joke,
            timestamp: new Date().toISOString()
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
});

// =============================================================================
// Rating Endpoints
// =============================================================================

/**
 * POST /api/jokes/:id/rate
 * Rate a joke (requires session)
 */
router.post('/:id/rate', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;
        let { session_id } = req.body;

        // Validate rating
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_RATING',
                    message: 'Rating must be between 1 and 5'
                },
                timestamp: new Date().toISOString()
            });
        }

        // Generate session if not provided
        if (!session_id) {
            session_id = uuidv4();
        }

        const dbService = DatabaseService.getInstance();
        const db = dbService.getDb();

        // Check if joke exists
        const joke = await db.get('SELECT id FROM jokes WHERE id = ? AND is_approved = 1', [id]);
        if (!joke) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'JOKE_NOT_FOUND',
                    message: 'Joke not found'
                },
                timestamp: new Date().toISOString()
            });
        }

        // Create or update session
        await db.run(`
            INSERT OR REPLACE INTO user_sessions (id, last_active) 
            VALUES (?, CURRENT_TIMESTAMP)
        `, [session_id]);

        // Insert or replace rating
        await db.run(`
            INSERT OR REPLACE INTO user_ratings (session_id, joke_id, rating) 
            VALUES (?, ?, ?)
        `, [session_id, id, rating]);

        const response: ApiResponse = {
            success: true,
            data: {
                session_id,
                joke_id: Number(id),
                rating
            },
            timestamp: new Date().toISOString()
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
});

// =============================================================================
// Favorites Endpoints  
// =============================================================================

/**
 * GET /api/jokes/favorites/:session_id
 * Get user's favorite jokes by session ID
 */
router.get('/favorites/:session_id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { session_id } = req.params;
        const { page = 1, limit = 20 } = req.query;

        const dbService = DatabaseService.getInstance();
        const db = dbService.getDb();

        const offset = (Number(page) - 1) * Number(limit);
        const favorites = await db.all(`
            SELECT jwd.*, uf.created_at as favorited_at
            FROM user_favorites uf
            JOIN jokes_with_details jwd ON uf.joke_id = jwd.id
            WHERE uf.session_id = ?
            ORDER BY uf.created_at DESC
            LIMIT ? OFFSET ?
        `, [session_id, limit, offset]);

        const totalResult = await db.get(
            'SELECT COUNT(*) as total FROM user_favorites WHERE session_id = ?',
            [session_id]
        );

        const response: ApiResponse = {
            success: true,
            data: favorites,
            meta: {
                page: Number(page),
                limit: Number(limit),
                total: totalResult.total,
                totalPages: Math.ceil(totalResult.total / Number(limit))
            },
            timestamp: new Date().toISOString()
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/jokes/:id/favorite
 * Add joke to favorites
 */
router.post('/:id/favorite', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        let { session_id } = req.body;

        // Generate session if not provided
        if (!session_id) {
            session_id = uuidv4();
        }

        const dbService = DatabaseService.getInstance();
        const db = dbService.getDb();

        // Check if joke exists
        const joke = await db.get('SELECT id FROM jokes WHERE id = ? AND is_approved = 1', [id]);
        if (!joke) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'JOKE_NOT_FOUND',
                    message: 'Joke not found'
                },
                timestamp: new Date().toISOString()
            });
        }

        // Create session if needed
        await db.run(`
            INSERT OR REPLACE INTO user_sessions (id, last_active) 
            VALUES (?, CURRENT_TIMESTAMP)
        `, [session_id]);

        // Add to favorites (ignore if already exists)
        await db.run(`
            INSERT OR IGNORE INTO user_favorites (session_id, joke_id) 
            VALUES (?, ?)
        `, [session_id, id]);

        const response: ApiResponse = {
            success: true,
            data: {
                session_id,
                joke_id: Number(id),
                favorited: true
            },
            timestamp: new Date().toISOString()
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /api/jokes/:id/favorite
 * Remove joke from favorites
 */
router.delete('/:id/favorite', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { session_id } = req.body;

        if (!session_id) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'SESSION_REQUIRED',
                    message: 'Session ID is required'
                },
                timestamp: new Date().toISOString()
            });
        }

        const dbService = DatabaseService.getInstance();
        const db = dbService.getDb();

        await db.run(
            'DELETE FROM user_favorites WHERE session_id = ? AND joke_id = ?',
            [session_id, id]
        );

        const response: ApiResponse = {
            success: true,
            data: {
                session_id,
                joke_id: Number(id),
                favorited: false
            },
            timestamp: new Date().toISOString()
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
});

export default router;