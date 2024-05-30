const db = require('../models');

const recipeService = {
    getAllRecipes: async () => {
        try {
            return await db.Recipe.findAll();
        } catch (error) {
            console.error('Error fetching recipes:', error);
            throw error;
        }
    },

    getRecipeById: async (id) => {
        try {
            return await db.Recipe.findByPk(id);
        } catch (error) {
            console.error('Error fetching recipe by id:', error);
            throw error;
        }
    },

    createRecipe: async (title, ingredients, steps) => {
        try {
            return await db.Recipe.create({ title, ingredients, steps });
        } catch (error) {
            console.error('Error creating recipe:', error);
            throw error;
        }
    },

    updateRecipe: async (id, title, ingredients, steps) => {
        try {
            const recipe = await db.Recipe.findByPk(id);
            if (recipe) {
                recipe.title = title;
                recipe.ingredients = ingredients;
                recipe.steps = steps;
                return await recipe.save();
            } else {
                throw new Error('Recipe not found');
            }
        } catch (error) {
            console.error('Error updating recipe:', error);
            throw error;
        }
    },

    deleteRecipe: async (id) => {
        try {
            const recipe = await db.Recipe.findByPk(id);
            if (recipe) {
                return await recipe.destroy();
            } else {
                throw new Error('Recipe not found');
            }
        } catch (error) {
            console.error('Error deleting recipe:', error);
            throw error;
        }
    }
};

module.exports = recipeService;