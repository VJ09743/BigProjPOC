import { Router, Request, Response, NextFunction } from 'express';
import DatabaseService from '../database/DatabaseService';
import { ApiResponse, PaginationParams, JokeQueryParams } from '../types';

const router = Router();

// =============================================================================
// Categories Endpoints
// =============================================================================

/**
 * GET /api/categories
 * Get all active categories with joke counts
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dbService = DatabaseService.getInstance();
        const db = dbService.getDb();

        const categories = await db.all(`
            SELECT 
                c.*,
                COUNT(j.id) as joke_count,
                COALESCE(AVG(CASE WHEN j.rating_count > 0 THEN CAST(j.rating_sum AS FLOAT) / j.rating_count END), 0) as avg_rating
            FROM categories c
            LEFT JOIN jokes j ON c.id = j.category_id AND j.is_approved = 1
            WHERE c.is_active = 1
            GROUP BY c.id
            ORDER BY c.sort_order ASC
        `);

        const response: ApiResponse = {
            success: true,
            data: categories,
            timestamp: new Date().toISOString()
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/categories/:slug
 * Get category by slug with jokes
 */
router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { slug } = req.params;
        const { page = 1, limit = 20 } = req.query as PaginationParams;

        const dbService = DatabaseService.getInstance();
        const db = dbService.getDb();

        // Get category
        const category = await db.get('SELECT * FROM categories WHERE slug = ? AND is_active = 1', [slug]);
        if (!category) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'CATEGORY_NOT_FOUND',
                    message: 'Category not found'
                },
                timestamp: new Date().toISOString()
            });
        }

        // Get paginated jokes for this category
        const offset = (Number(page) - 1) * Number(limit);
        const jokes = await db.all(`
            SELECT * FROM jokes_with_details
            WHERE category_slug = ?
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        `, [slug, limit, offset]);

        // Get total count
        const totalResult = await db.get(
            'SELECT COUNT(*) as total FROM jokes j JOIN categories c ON j.category_id = c.id WHERE c.slug = ? AND j.is_approved = 1',
            [slug]
        );

        const response: ApiResponse = {
            success: true,
            data: {
                category,
                jokes
            },
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

export default router;