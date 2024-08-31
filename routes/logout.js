const express = require('express');
const router = express.Router();

// Logout route
router.get('/', (req, res) => {
    // Destroy the session
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Internal Server Error');
        }
        // Redirect to the main page after logout
        res.redirect('/login');
    });
});

module.exports = router;