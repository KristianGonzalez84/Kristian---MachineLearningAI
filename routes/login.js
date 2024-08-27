const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

// Render the login page
router.get('/', (req, res) => {
    res.render('login', { user: req.session.user, error: null });
});

// Handle login form submission
router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await userService.authenticateUser(username, password);
        req.session.userId = user.id;
        req.session.user = user; // Storing the full user object in the session for consistent access
        res.redirect('/profile');
    } catch (error) {
        console.log('Login Error:', error.message); // Log login error
        res.render('login', { user: null, error: 'Invalid username or password' });
    }
});

module.exports = router;