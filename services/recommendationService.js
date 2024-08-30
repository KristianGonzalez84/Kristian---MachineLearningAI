const db = require('../models'); // Adjust the path as needed
const TodaysRecommendation = db.TodaysRecommendation;
const Recipe = db.Recipe;
const { Op } = require('sequelize'); // Import Op for query operators

/**
 * Generate and save recommendations periodically.
 */
async function generateAndSaveRecommendations() {
    try {
        // Fetch all recipes that are not deleted
        const recipes = await Recipe.findAll({ where: { is_deleted: false } });
        
        if (recipes.length === 0) {
            console.log('No recipes available for recommendations.');
            return;
        }

        // Example logic: randomly select recipes for the recommendations
        const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];

        // Create recommendation without associating with a specific user
        await TodaysRecommendation.create({
            recipeId: randomRecipe.id,
            userId: null, // Adjust logic if recommendations should be user-specific
            recommendedAt: new Date()
        });

        console.log('Generated today\'s recommendation:', randomRecipe.title);
    } catch (error) {
        console.error('An error occurred while generating recommendations:', error);
        throw error;
    }
}

/**
 * Save recommendations based on provided recipe IDs and user ID.
 * @param {number} userId - The ID of the user for whom the recommendations are being saved.
 * @param {number[]} recipeIds - Array of recipe IDs to be saved as recommendations.
 */
async function saveTodaysRecommendations(userId, recipeIds) {
    try {
        // Create recommendation entries in bulk
        const recommendations = recipeIds.map(recipeId => ({
            userId,
            recipeId,
            recommendedAt: new Date(),
        }));

        await TodaysRecommendation.bulkCreate(recommendations);
        console.log('Recommendations saved successfully!');
    } catch (error) {
        console.error('An error occurred while saving recommendations:', error);
        throw error;
    }
}

/**
 * Fetch today's recommendations for a user.
 * @param {number} userId - The ID of the user whose recommendations are being fetched.
 */
async function getTodaysRecommendations(userId) {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to the start of the day

        // Fetch recommendations for today
        const recommendations = await TodaysRecommendation.findAll({
            where: {
                userId,
                recommendedAt: {
                    [Op.gte]: today // Only today's recommendations
                }
            },
            include: [Recipe] // Include recipe details in the results
        });

        return recommendations;
    } catch (error) {
        console.error('An error occurred while fetching recommendations:', error);
        throw error;
    }
}

module.exports = {
    generateAndSaveRecommendations,
    saveTodaysRecommendations,
    getTodaysRecommendations,
};