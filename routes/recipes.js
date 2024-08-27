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

module.exports = router;