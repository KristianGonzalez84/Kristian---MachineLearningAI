const db = require('../models');

const recipeService = {
    // Get all recipes that are not marked as deleted
    getAllRecipes: async () => {
        try {
            return await db.Recipe.findAll({ where: { is_deleted: false } });
        } catch (error) {
            console.error('Error fetching recipes:', error);
            throw new Error('Unable to fetch recipes');
        }
    },

    // Get a single recipe by ID if it's not marked as deleted
    getRecipeById: async (recipeId) => {
        try {
            const recipe = await db.Recipe.findOne({ where: { id: recipeId, is_deleted: false } });
            if (!recipe) {
                throw new Error('Recipe not found');
            }
            return recipe;
        } catch (error) {
            console.error(`Error fetching recipe with ID ${recipeId}:`, error);
            throw new Error('Unable to fetch recipe');
        }
    },

    // Create a new recipe
    createRecipe: async (title, ingredients, steps) => {
        try {
            const newRecipe = await db.Recipe.create({ title, ingredients, steps });
            return newRecipe;
        } catch (error) {
            console.error('Error creating recipe:', error);
            throw new Error('Unable to create recipe');
        }
    },

    // Update an existing recipe
    updateRecipe: async (recipeId, title, ingredients, steps) => {
        try {
            const recipe = await db.Recipe.findByPk(recipeId);
            if (!recipe || recipe.is_deleted) {
                throw new Error('Recipe not found or is deleted');
            }
            recipe.title = title;
            recipe.ingredients = ingredients;
            recipe.steps = steps;
            return await recipe.save();
        } catch (error) {
            console.error(`Error updating recipe with ID ${recipeId}:`, error);
            throw new Error('Unable to update recipe');
        }
    },

    // Soft delete a recipe by marking it as deleted
    deleteRecipe: async (recipeId) => {
        try {
            const recipe = await db.Recipe.findByPk(recipeId);
            if (!recipe) {
                throw new Error('Recipe not found');
            }
            recipe.is_deleted = true;
            return await recipe.save();
        } catch (error) {
            console.error(`Error deleting recipe with ID ${recipeId}:`, error);
            throw new Error('Unable to delete recipe');
        }
    }
};

module.exports = recipeService;