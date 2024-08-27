const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/authentication');
const userService = require('../services/userService');
const { User, Favorite, Recipe, RecentActivity } = require('../models');

// Profile page route
router.get('/', isAuthenticated, async (req, res) => {
    try {
        console.log('Profile route accessed');
        const userId = req.session.userId;

        // Fetch user
        const user = await userService.findUserById(userId);
        if (!user) {
            return res.redirect('/login'); // Redirect to login if user not found
        }

        // Fetch favorite recipes
        const favorites = await Recipe.findAll({
            include: {
                model: Favorite,
                where: { userId: user.id }
            }
        });

        // Fetch recent activities
        const recentActivities = await RecentActivity.findAll({ 
            where: { userId: user.id },
            order: [['timestamp', 'DESC']],
            limit: 10 // Fetch latest 10 activities
        });

        // Render the profile page with user, favorites, and recent activities
        res.render('profile', { user, favorites, recentActivities });
    } catch (error) {
        console.error('Error fetching profile data:', error);
        res.status(500).render('error', { message: 'Something went wrong. Please try again later.', user: req.session.user });
    }
});

module.exports = router;