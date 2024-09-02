const db = require('../models');
const { Favorite, User, Recipe } = db;

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
    },

    // Add a recipe to a user's favorites
    addFavorite: async (recipeId, userId) => {
        try {
            console.log(`Adding favorite: recipeId = ${recipeId}, userId = ${userId}`);

            // Ensure both recipe and user exist
            const recipe = await Recipe.findByPk(recipeId);
            const user = await User.findByPk(userId);

            if (!recipe) {
                throw new Error('Recipe not found');
            }
            if (!user) {
                throw new Error('User not found');
            }

            // Check if the recipe is already in favorites
            const existingFavorite = await Favorite.findOne({
                where: { userId, recipeId }
            });

            if (existingFavorite) {
                throw new Error('Recipe already marked as favorite');
            }

            await Favorite.create({ userId, recipeId });
            return { message: 'Recipe added to favorites' };
        } catch (error) {
            console.error(`Error adding recipe ${recipeId} to favorites:`, error);
            throw new Error('Unable to add recipe to favorites');
        }
    },

    // Remove a recipe from a user's favorites
    removeFavorite: async (recipeId, userId) => {
        try {
            const favorite = await Favorite.findOne({
                where: { userId, recipeId }
            });

            if (!favorite) {
                // Return a specific message instead of throwing an error
                return { message: 'Recipe not found in favorites' };
            }

            await favorite.destroy();
            return { message: 'Recipe removed from favorites' };
        } catch (error) {
            console.error(`Error removing recipe ${recipeId} from favorites:`, error.message);
            throw new Error('Unable to remove recipe from favorites');
        }
    }
};

module.exports = recipeService;