const express = require('express');
const router = express.Router();

function createAdminRouter(jokeModel) {
    // Simple authentication middleware (for demo purposes)
    const requireAuth = (req, res, next) => {
        const adminPassword = process.env.ADMIN_PASSWORD || 'secure_admin_password_123';
        const providedPassword = req.headers['x-admin-password'];
        
        if (providedPassword === adminPassword) {
            next();
        } else {
            res.status(401).json({
                success: false,
                message: 'Admin authentication required'
            });
        }
    };

    // GET /api/admin/moderation-queue - Get pending submissions
    router.get('/moderation-queue', requireAuth, async (req, res) => {
        try {
            const pendingJokes = await jokeModel.getModerationQueue();
            res.json({
                success: true,
                data: pendingJokes
            });
        } catch (error) {
            console.error('Error fetching moderation queue:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    });

    // POST /api/admin/moderate/:id - Approve/reject submission  
    router.post('/moderate/:id', requireAuth, async (req, res) => {
        try {
            const { id } = req.params;
            const { action, reviewNotes } = req.body;
            
            if (!['approved', 'rejected'].includes(action)) {
                return res.status(400).json({
                    success: false,
                    message: 'Action must be either "approved" or "rejected"'
                });
            }
            
            const moderatedJoke = await jokeModel.moderateJoke(
                parseInt(id), 
                action, 
                reviewNotes, 
                'admin'
            );
            
            if (moderatedJoke) {
                res.json({
                    success: true,
                    data: moderatedJoke,
                    message: `Joke ${action} successfully`
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Joke not found'
                });
            }
        } catch (error) {
            console.error('Error moderating joke:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    });

    // GET /api/admin/stats - Get basic statistics
    router.get('/stats', requireAuth, async (req, res) => {
        try {
            // This is a simple stats endpoint - in production you'd have proper analytics
            res.json({
                success: true,
                data: {
                    message: 'Stats endpoint implemented - add analytics as needed',
                    timestamp: new Date().toISOString()
                }
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    });

    return router;
}

module.exports = createAdminRouter;