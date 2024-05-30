const express = require('express');
const router = express.Router();
const db = require('../models');
const Recipe = db.Recipe;

// Render the index page
router.get('/', async function(req, res, next) {
  // Fetch all recipes from the database
  const recipes = await Recipe.findAll();
  // Render the index template and pass the recipes array to it
  res.render('index', { title: 'Recipe System', recipes: recipes });
});

// Render the recipes page
router.get('/recipes', async function(req, res, next) {
  // Fetch all recipes from the database
  const recipes = await Recipe.findAll();
  // Render the recipes template and pass the recipes array to it
  res.render('recipes', { title: 'Recipes', recipes: recipes });
});

// Render the profile page
router.get('/profile', function(req, res, next) {
  res.render('profile', { title: 'Profile' });
});

module.exports = router;