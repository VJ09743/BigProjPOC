import { Router, Request, Response, NextFunction } from 'express';
import DatabaseService from '../database/DatabaseService';
import { ApiResponse, SearchQueryParams } from '../types';

const router = Router();

/**
 * GET /api/search
 * Full-text search across jokes with advanced filtering
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            q: query,
            page = 1,
            limit = 20,
            category,
            min_rating,
            type = 'all',
            featured
        } = req.query as SearchQueryParams;

        if (!query || query.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'MISSING_QUERY',
                    message: 'Search query is required'
                },
                timestamp: new Date().toISOString()
            });
        }

        const dbService = DatabaseService.getInstance();
        const db = dbService.getDb();

        // Clean and prepare FTS query
        const sanitizedQuery = query.trim().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');
        const ftsQuery = `"${sanitizedQuery}"`;

        // Build WHERE clause for additional filters
        let whereClause = 'WHERE 1=1';
        const params: any[] = [];

        if (category) {
            whereClause += ' AND category_slug = ?';
            params.push(category);
        }

        if (min_rating) {
            whereClause += ' AND avg_rating >= ?';
            params.push(Number(min_rating));
        }

        if (featured !== undefined) {
            whereClause += ' AND is_featured = ?';
            params.push(featured ? 1 : 0);
        }

        let searchResults;
        let countQuery;

        if (type === 'content') {
            // Search only in joke content
            const offset = (Number(page) - 1) * Number(limit);
            searchResults = await db.all(`
                SELECT jwd.*, fts.rank
                FROM jokes_fts fts
                JOIN jokes_with_details jwd ON fts.joke_id = jwd.id
                ${whereClause} AND fts.jokes_fts MATCH ?
                ORDER BY fts.rank
                LIMIT ? OFFSET ?
            `, [...params, ftsQuery, limit, offset]);

            countQuery = await db.get(`
                SELECT COUNT(*) as total
                FROM jokes_fts fts
                JOIN jokes_with_details jwd ON fts.joke_id = jwd.id
                ${whereClause} AND fts.jokes_fts MATCH ?
            `, [...params, ftsQuery]);

        } else if (type === 'title') {
            // Search only in joke titles (category names)
            const offset = (Number(page) - 1) * Number(limit);
            searchResults = await db.all(`
                SELECT *, 1 as rank FROM jokes_with_details
                ${whereClause} AND category_name LIKE ?
                ORDER BY avg_rating DESC
                LIMIT ? OFFSET ?
            `, [...params, `%${sanitizedQuery}%`, limit, offset]);

            countQuery = await db.get(`
                SELECT COUNT(*) as total FROM jokes_with_details
                ${whereClause} AND category_name LIKE ?
            `, [...params, `%${sanitizedQuery}%`]);

        } else {
            // Search both content and titles (default)
            const offset = (Number(page) - 1) * Number(limit);
            
            // Get content matches
            const contentMatches = await db.all(`
                SELECT jwd.*, fts.rank, 'content' as match_type
                FROM jokes_fts fts
                JOIN jokes_with_details jwd ON fts.joke_id = jwd.id
                ${whereClause} AND fts.jokes_fts MATCH ?
                ORDER BY fts.rank
                LIMIT ? OFFSET ?
            `, [...params, ftsQuery, limit, offset]);

            // Get title matches
            const titleMatches = await db.all(`
                SELECT *, 1 as rank, 'title' as match_type FROM jokes_with_details
                ${whereClause} AND category_name LIKE ?
                ORDER BY avg_rating DESC
                LIMIT ? OFFSET ?
            `, [...params, `%${sanitizedQuery}%`, limit, offset]);

            // Combine and deduplicate results
            const combinedMap = new Map();
            
            // Add content matches first (higher priority)
            contentMatches.forEach(joke => {
                combinedMap.set(joke.id, { ...joke, match_types: ['content'] });
            });

            // Add title matches, combining match types if duplicate
            titleMatches.forEach(joke => {
                if (combinedMap.has(joke.id)) {
                    const existing = combinedMap.get(joke.id);
                    existing.match_types.push('title');
                } else {
                    combinedMap.set(joke.id, { ...joke, match_types: ['title'] });
                }
            });

            // Sort by relevance (content matches first, then by rating)
            searchResults = Array.from(combinedMap.values())
                .sort((a, b) => {
                    if (a.match_types.includes('content') && !b.match_types.includes('content')) return -1;
                    if (!a.match_types.includes('content') && b.match_types.includes('content')) return 1;
                    return (b.avg_rating || 0) - (a.avg_rating || 0);
                })
                .slice(0, Number(limit));

            // Get total count for combined search
            const contentCount = await db.get(`
                SELECT COUNT(*) as total
                FROM jokes_fts fts
                JOIN jokes_with_details jwd ON fts.joke_id = jwd.id
                ${whereClause} AND fts.jokes_fts MATCH ?
            `, [...params, ftsQuery]);

            const titleCount = await db.get(`
                SELECT COUNT(*) as total FROM jokes_with_details
                ${whereClause} AND category_name LIKE ?
            `, [...params, `%${sanitizedQuery}%`]);

            // Approximate total (may include duplicates)
            countQuery = { total: contentCount.total + titleCount.total };
        }

        const response: ApiResponse = {
            success: true,
            data: searchResults,
            meta: {
                page: Number(page),
                limit: Number(limit),
                total: countQuery.total,
                totalPages: Math.ceil(countQuery.total / Number(limit)),
                query: sanitizedQuery,
                searchType: type
            },
            timestamp: new Date().toISOString()
        };

        res.json(response);

    } catch (error) {
        console.error('Search error:', error);
        next(error);
    }
});

/**
 * GET /api/search/suggestions
 * Get search suggestions based on query
 */
router.get('/suggestions', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { q: query, limit = 10 } = req.query;

        if (!query || String(query).trim().length < 2) {
            return res.json({
                success: true,
                data: [],
                timestamp: new Date().toISOString()
            });
        }

        const dbService = DatabaseService.getInstance();
        const db = dbService.getDb();

        const sanitizedQuery = String(query).trim().toLowerCase();

        // Get category name suggestions
        const categoryResults = await db.all(`
            SELECT DISTINCT category_name as suggestion, 'category' as type
            FROM categories
            WHERE LOWER(category_name) LIKE ?
            LIMIT ?
        `, [`%${sanitizedQuery}%`, Math.floor(Number(limit) / 2)]);

        // Get popular search terms from joke content (simplified)
        const contentResults = await db.all(`
            SELECT DISTINCT 
                CASE 
                    WHEN content LIKE ? THEN ?
                    ELSE substr(content, 1, 50) || '...'
                END as suggestion,
                'content' as type
            FROM jokes
            WHERE LOWER(content) LIKE ? 
            AND is_approved = 1
            LIMIT ?
        `, [`%${sanitizedQuery}%`, sanitizedQuery, `%${sanitizedQuery}%`, Math.ceil(Number(limit) / 2)]);

        const suggestions = [...categoryResults, ...contentResults];

        const response: ApiResponse = {
            success: true,
            data: suggestions,
            meta: {
                page: 1,
                limit: Number(limit),
                total: suggestions.length,
                totalPages: 1,
                query: sanitizedQuery
            },
            timestamp: new Date().toISOString()
        };

        res.json(response);

    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/search/trending
 * Get trending search terms (mock implementation)
 */
router.get('/trending', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { limit = 10 } = req.query;

        const dbService = DatabaseService.getInstance();
        const db = dbService.getDb();

        // Get most popular categories by view count
        const trendingCategories = await db.all(`
            SELECT 
                c.name as term,
                c.slug,
                SUM(j.view_count) as popularity,
                'category' as type
            FROM categories c
            JOIN jokes j ON c.id = j.category_id
            WHERE j.is_approved = 1
            GROUP BY c.id, c.name, c.slug
            ORDER BY popularity DESC
            LIMIT ?
        `, [limit]);

        const response: ApiResponse = {
            success: true,
            data: trendingCategories,
            meta: {
                page: 1,
                limit: Number(limit),
                total: trendingCategories.length,
                totalPages: 1,
                type: 'trending'
            },
            timestamp: new Date().toISOString()
        };

        res.json(response);

    } catch (error) {
        next(error);
    }
});

export default router;