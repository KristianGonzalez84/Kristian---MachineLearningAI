const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/authentication');
const userService = require('../services/userService');
const recommendationService = require('../services/recommendationService'); // Import the recommendation service
const { User, Favorite, Recipe, RecentActivity, TodaysRecommendation } = require('../models');

router.get('/', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.userId;

        // Fetch user
        const user = await userService.findUserById(userId);
        if (!user) {
            return res.redirect('/login');
        }

        // Fetch favorite recipes
        const favorites = await Recipe.findAll({
            include: {
                model: Favorite,
                where: { userId }
            }
        });

        // Fetch recent activities
        const recentActivities = await RecentActivity.findAll({ 
            where: { userId },
            order: [['timestamp', 'DESC']],
            limit: 10 // Fetch latest 10 activities
        });

        // Fetch today's recommendations
        const todaysRecommendations = await recommendationService.getTodaysRecommendations(userId);

        // Render the profile page with user, favorites, recent activities, and today's recommendations
        res.render('profile', { user, favorites, recentActivities, todaysRecommendations });
    } catch (error) {
        console.error('Error fetching profile data:', error);
        res.status(500).render('error', { message: 'Something went wrong. Please try again later.', user: req.session.user });
    }
});

module.exports = router;