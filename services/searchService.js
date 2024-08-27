const db = require('../models');
const Recipe = db.Recipe;
const { Op } = db.Sequelize;

const searchService = {
    searchRecipes: async (keyword) => {
        try {
            return await Recipe.findAll({
                where: {
                    title: {
                        [Op.like]: `%${keyword}%`
                    }
                }
            });
        } catch (error) {
            throw new Error('Error searching recipes: ' + error.message);
        }
    }
};

module.exports = searchService;