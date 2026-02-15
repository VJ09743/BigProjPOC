const express = require('express');
const router = express.Router();

function createCategoriesRouter(categoryModel) {
    // GET /api/categories - Get all categories with joke counts
    router.get('/', async (req, res) => {
        try {
            const categories = await categoryModel.getAllCategories();
            res.json({
                success: true,
                data: categories
            });
        } catch (error) {
            console.error('Error fetching categories:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    });

    // GET /api/categories/:slug - Get specific category by slug
    router.get('/:slug', async (req, res) => {
        try {
            const { slug } = req.params;
            const category = await categoryModel.getCategoryBySlug(slug);
            
            if (category) {
                res.json({
                    success: true,
                    data: category
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Category not found'
                });
            }
        } catch (error) {
            console.error('Error fetching category:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    });

    return router;
}

module.exports = createCategoriesRouter;