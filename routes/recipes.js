const express = require('express');
const router = express.Router();
const db = require('../models');
const Recipe = db.Recipe;

// Route to display all recipes
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.findAll();
        res.render('recipes', { recipes });
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).send('Error fetching recipes');
    }
});

// Route to display the form to add a new recipe
router.get('/new', (req, res) => {
    res.render('recipe-form', { recipe: null });
});

// Route to handle the form submission for adding a new recipe
router.post('/new', async (req, res, next) => {
    try {
        const { title, ingredients, steps } = req.body;
        await Recipe.create({ title, ingredients, steps });
        res.redirect('/recipes');
    } catch (error) {
        console.error('Error creating recipe:', error);
        res.status(500).send('Error creating recipe');
    }
});

// Route to display a specific recipe
router.get('/:id', async (req, res) => {
    try {
        const recipeId = req.params.id;
        const recipe = await Recipe.findByPk(recipeId);
        if (recipe) {
            res.render('recipe-details', { recipe });
        } else {
            res.status(404).send('Recipe not found');
        }
    } catch (error) {
        console.error('Error fetching recipe by id:', error);
        res.status(500).send('Error fetching recipe by id');
    }
});

// Route to display the form to edit an existing recipe
router.get('/:id/edit', async (req, res) => {
    try {
        const recipeId = req.params.id;
        const recipe = await Recipe.findByPk(recipeId);
        if (recipe) {
            res.render('recipe-form', { recipe });
        } else {
            res.status(404).send('Recipe not found');
        }
    } catch (error) {
        console.error('Error fetching recipe for edit:', error);
        res.status(500).send('Error fetching recipe for edit');
    }
});

// Route to handle the form submission for editing an existing recipe
router.post('/:id/edit', async (req, res) => {
    try {
        const recipeId = req.params.id;
        const { title, ingredients, steps } = req.body;
        const recipe = await Recipe.findByPk(recipeId);
        if (recipe) {
            recipe.title = title;
            recipe.ingredients = ingredients;
            recipe.steps = steps;
            await recipe.save();
            res.redirect('/recipes');
        } else {
            res.status(404).send('Recipe not found');
        }
    } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).send('Error updating recipe');
    }
});

// Route to handle deleting a recipe
router.post('/:id/delete', async (req, res) => {
    try {
        const recipeId = req.params.id;
        const recipe = await Recipe.findByPk(recipeId);
        if (recipe) {
            await recipe.destroy();
            res.redirect('/recipes');
        } else {
            res.status(404).send('Recipe not found');
        }
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).send('Error deleting recipe');
    }
});

module.exports = router;