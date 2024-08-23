const express = require('express');
const router = express.Router();
const User = require('../models').User; // Adjust the path to your User model

// Render the registration page
router.get('/', (req, res) => {
    res.render('register', { error: null });
});

// Handle registration form submission
router.post('/', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Perform your registration logic here (e.g., save user to the database)
        // For example, hashing the password and saving user info
        await User.create({
            name,
            email,
            password // Make sure to hash the password in a real application
        });
        
        // Redirect to login page or profile after successful registration
        res.redirect('/login');
    } catch (error) {
        // Render the registration page with an error message
        res.render('register', { error: 'Registration failed. Please try again.' });
    }
});

module.exports = router;