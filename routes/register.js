const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

// Middleware to validate registration input
const validateRegistration = (req, res, next) => {
    const { name, username, password } = req.body;
    if (!name || !username || !password) {
        return res.render('register', { error: 'All fields are required', user: req.session.user });
    }
    next();
};

// Render the registration page
router.get('/', (req, res) => {
    res.render('register', { error: null, user: req.session.user });
});

// Registration route
router.post('/', validateRegistration, async (req, res) => {
    const { name, username, password } = req.body;

    try {
        const newUser = await userService.registerUser(name, username, password);
        console.log('Registered User:', newUser); // Log user details
        res.redirect('/login');
    } catch (error) {
        console.log('Registration Error:', error.message); // Log registration error
        if (error.message === 'Username already registered') {
            res.render('register', { error: 'Username already registered', user: req.session.user });
        } else {
            res.render('register', { error: 'Something went wrong, please try again', user: req.session.user });
        }
    }
});

module.exports = router;