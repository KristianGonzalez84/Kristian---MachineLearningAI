const express = require('express');
const router = express.Router();
const { saveTodaysRecommendations } = require('../services/recommendationService'); // Import the service function
const { body, validationResult } = require('express-validator'); // For request validation

// POST request to save today's recommendations for a user
router.post(
    '/save',
    [
        body('userId').isInt().withMessage('User ID must be an integer'),
        body('recipeIds').isArray().withMessage('Recipe IDs must be an array'),
        body('recipeIds.*').isInt().withMessage('Each Recipe ID must be an integer')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { userId, recipeIds } = req.body; // Array of recipe IDs

            await saveTodaysRecommendations(userId, recipeIds); // Use the service function

            res.status(201).json({ message: 'Recommendations saved successfully!' });
        } catch (error) {
            console.error('An error occurred while saving recommendations:', error);
            res.status(500).json({ error: 'An error occurred while saving recommendations.' });
        }
    }
);

module.exports = router;