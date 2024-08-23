const express = require('express');
const router = express.Router();

// Show the login form
router.get('/', (req, res) => {
    res.render('login', { error: null });
});

// Handle login form submission
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    // Assume you have some login logic here
    const user = await authenticateUser(email, password); // Example function

    if (user) {
        // User is authenticated, redirect to their profile
        res.redirect('/profile');
    } else {
        // Authentication failed, re-render the login page with an error message
        res.render('login', { error: 'Invalid email or password.' });
    }
});

module.exports = router;