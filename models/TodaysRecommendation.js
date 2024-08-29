module.exports = (sequelize, Sequelize) => {
    const TodaysRecommendation = sequelize.define('TodaysRecommendation', {
        userId: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            },
        },
        recipeId: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Recipes', 
                key: 'id',
            },
        },
        recommendedAt: {
            type: Sequelize.DataTypes.DATE,
            defaultValue: Sequelize.DataTypes.NOW,
        },
    }, {
        timestamps: false,
    });

    return TodaysRecommendation;
};