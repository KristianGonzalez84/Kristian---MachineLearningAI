const express = require('express');
const router = express.Router();
const searchService = require('../services/searchService');

// Render the search page
router.get('/', (req, res) => {
    res.render('search', { recipes: [], error: null, user: req.session.user });
});

// Handle search functionality
router.post('/', async (req, res) => {
    const keyword = req.body.keyword.trim();

    // Basic validation
    if (!keyword) {
        return res.render('search', { recipes: [], error: 'Search keyword cannot be empty', user: req.session.user });
    }

    try {
        // Use search service to fetch recipes
        const recipes = await searchService.searchRecipes(keyword);
        res.render('search', { recipes, error: null, user: req.session.user });
    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;