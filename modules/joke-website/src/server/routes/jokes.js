const express = require('express');
const router = express.Router();

function createJokesRouter(jokeModel, contentFilter) {
    // GET /api/jokes/random - Get random joke from all categories
    router.get('/random', async (req, res) => {
        try {
            const joke = await jokeModel.getRandomJoke();
            if (joke) {
                res.json({
                    success: true,
                    data: joke
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'No jokes found'
                });
            }
        } catch (error) {
            console.error('Error fetching random joke:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    });

    // GET /api/jokes/category/:slug - Get jokes by category with pagination
    router.get('/category/:slug', async (req, res) => {
        try {
            const { slug } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = Math.min(parseInt(req.query.limit) || 10, 50); // Max 50 per page
            
            const jokes = await jokeModel.getJokesByCategory(slug, page, limit);
            
            res.json({
                success: true,
                data: jokes,
                pagination: {
                    page: page,
                    limit: limit,
                    total: jokes.length // Note: This is just current page count, not total
                }
            });
        } catch (error) {
            console.error('Error fetching jokes by category:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    });

    // GET /api/jokes/search?q=keyword - Search jokes by keyword
    router.get('/search', async (req, res) => {
        try {
            const { q: query } = req.query;
            
            if (!query || query.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Search query is required'
                });
            }
            
            const page = parseInt(req.query.page) || 1;
            const limit = Math.min(parseInt(req.query.limit) || 10, 50);
            
            const jokes = await jokeModel.searchJokes(query, page, limit);
            
            res.json({
                success: true,
                data: jokes,
                pagination: {
                    page: page,
                    limit: limit,
                    total: jokes.length
                },
                query: query
            });
        } catch (error) {
            console.error('Error searching jokes:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    });

    // GET /api/jokes/:id - Get specific joke by ID
    router.get('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const joke = await jokeModel.getJokeById(parseInt(id));
            
            if (joke) {
                res.json({
                    success: true,
                    data: joke
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Joke not found'
                });
            }
        } catch (error) {
            console.error('Error fetching joke by ID:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    });

    // POST /api/jokes/:id/rate - Rate a joke (thumbs up/down)
    router.post('/:id/rate', async (req, res) => {
        try {
            const { id } = req.params;
            const { rating } = req.body;
            
            if (!rating || !['positive', 'negative'].includes(rating)) {
                return res.status(400).json({
                    success: false,
                    message: 'Rating must be either "positive" or "negative"'
                });
            }
            
            const isPositive = rating === 'positive';
            const updatedJoke = await jokeModel.rateJoke(parseInt(id), isPositive);
            
            if (updatedJoke) {
                res.json({
                    success: true,
                    data: updatedJoke,
                    message: `Joke rated ${rating}`
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Joke not found'
                });
            }
        } catch (error) {
            console.error('Error rating joke:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    });

    // POST /api/jokes/submit - Submit new joke for moderation
    router.post('/submit', contentFilter.validateSubmission, async (req, res) => {
        try {
            const { setup, punchline, category_id, submitted_by } = req.body;
            
            if (!category_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Category is required'
                });
            }
            
            const jokeId = await jokeModel.submitJoke({
                setup,
                punchline,
                category_id: parseInt(category_id),
                submitted_by
            });
            
            res.status(201).json({
                success: true,
                data: { jokeId },
                message: 'Joke submitted successfully and is pending moderation'
            });
        } catch (error) {
            console.error('Error submitting joke:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    });

    return router;
}

module.exports = createJokesRouter;