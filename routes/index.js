const express = require('express');
const router = express.Router();
const db = require('../models');
const Recipe = db.Recipe;

// Render the index page
router.get('/', async function(req, res, next) {
  // Fetch all recipes from the database
  const recipes = await Recipe.findAll();
  
  // Pass the user object along with recipes to the view
  res.render('index', { 
    title: 'Recipe System', 
    recipes: recipes, 
    user: req.session.user
  });
});

// Render the recipes page
router.get('/recipes', async function(req, res, next) {
  // Fetch all recipes from the database
  const recipes = await Recipe.findAll();

  // Pass the user object along with recipes to the view
  res.render('recipes', { 
    title: 'Recipes', 
    recipes: recipes, 
    user: req.session.user
  });
});

module.exports = router;