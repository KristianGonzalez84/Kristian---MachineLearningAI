const express = require('express');
const router = express.Router();
const recipeService = require('../services/recipeService');

// Render the form to add a new recipe
router.get('/new', (req, res) => {
    res.render('recipe-form', { user: req.session.user }); // Render the form to add a new recipe
});

// Handle the form submission to add a new recipe
router.post('/new', async (req, res) => {
    const { title, ingredients, steps } = req.body;

    try {
        // Use the recipeService to create a new recipe
        await recipeService.createRecipe(title, ingredients, steps);
        res.redirect('/recipes'); // Redirect to the list of recipes after adding a new one
    } catch (error) {
        console.error('Error adding recipe:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to display a specific recipe
router.get('/:id', async (req, res) => {
    try {
        const recipeId = req.params.id;
        const recipe = await recipeService.getRecipeById(recipeId);
        if (recipe) {
            res.render('recipe-details', { recipe, user: req.session.user  });
        } else {
            res.status(404).send('Recipe not found');
        }
    } catch (error) {
        console.error('Error fetching recipe by id:', error);
        res.status(500).send('Error fetching recipe by id');
    }
});

// PUT /recipes/:id - Update an existing recipe by ID
router.put('/:id', async (req, res) => {
    try {
        const recipeId = req.params.id;
        const { title, ingredients, steps } = req.body;
        if (!title || !ingredients || !steps) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const updatedRecipe = await recipeService.updateRecipe(recipeId, title, ingredients, steps);
        res.status(200).json(updatedRecipe);
    } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).json({ error: 'Error updating recipe' });
    }
});

// DELETE /recipes/:id - Soft delete a recipe by ID
router.delete('/:id', async (req, res) => {
    try {
        const recipeId = req.params.id;
        await recipeService.deleteRecipe(recipeId);
        res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).json({ error: 'Error deleting recipe' });
    }
});

// Buttons 'like','dislike' and 'save'
// Handle "like" button click
router.post('/:id/like', async (req, res) => {
    const recipeId = req.params.id;
    try {
        // Logic to handle "like" (e.g., update database, user profile, etc.)
        console.log(`Recipe ${recipeId} liked`);
        res.redirect(`/recipes/${recipeId}`);
    } catch (error) {
        console.error('Error liking recipe:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Handle "dislike" button click
router.post('/:id/dislike', async (req, res) => {
    const recipeId = req.params.id;
    try {
        // Logic to handle "dislike" (e.g., update database, user profile, etc.)
        console.log(`Recipe ${recipeId} disliked`);
        res.redirect(`/recipes/${recipeId}`);
    } catch (error) {
        console.error('Error disliking recipe:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Handle "save" button click
router.post('/:id/save', async (req, res) => {
    const recipeId = req.params.id;
    try {
        // Logic to handle "save" (e.g., add recipe to user's saved list)
        console.log(`Recipe ${recipeId} saved`);
        res.redirect(`/recipes/${recipeId}`);
    } catch (error) {
        console.error('Error saving recipe:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Favourites //
router.post('/:id/favorite', async (req, res) => {
    const recipeId = req.params.id;
    const user = req.session.user;

    if (!user) {
        return res.status(401).send('User not authenticated');
    }

    try {
        await recipeService.addFavorite(recipeId, user.id);
        res.redirect(`/recipes/${recipeId}`);
    } catch (error) {
        console.error('Error adding recipe to favorites:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Remove from favorites
router.post('/:id/unfavorite', async (req, res) => {
    const recipeId = req.params.id;
    const userId = req.session.user.id; // Assuming user ID is stored in session

    try {
        await recipeService.removeFavorite(recipeId, userId);
        res.redirect(`/recipes/${recipeId}`);
    } catch (error) {
        console.error('Error removing recipe from favorites:', error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;