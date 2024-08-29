const db = require('../models'); // Adjust the path as needed
const TodaysRecommendation = db.TodaysRecommendation;
const Recipe = db.Recipe;

async function generateAndSaveRecommendations() {
    // Example logic: randomly select a recipe as today's recommendation
    const recipes = await Recipe.findAll({ where: { is_deleted: false } });
    const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];

    await TodaysRecommendation.create({
        recipeId: randomRecipe.id,
        userId: null // Adjust logic to associate with specific users if needed
    });

    console.log('Generated today\'s recommendation:', randomRecipe.title);
}

module.exports = generateAndSaveRecommendations;