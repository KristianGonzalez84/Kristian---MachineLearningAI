const express = require('express');
const router = express.Router();
const TodaysRecommendation = require('../models/todaysRecommendation');
const { Recipe, User } = require('../models'); 

// POST request to save today's recommendations for a user
router.post('/save', async (req, res) => {
    try {
        const { userId, recipeIds } = req.body; // Array of recipe IDs

        const recommendations = recipeIds.map(recipeId => ({
            userId,
            recipeId,
            recommendedAt: new Date(),
        }));

        await TodaysRecommendation.bulkCreate(recommendations);

        res.status(201).json({ message: 'Recommendations saved successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while saving recommendations.' });
    }
});

module.exports = router;