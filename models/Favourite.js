module.exports = (sequelize, Sequelize) => {
    const Favorite = sequelize.define('Favorite', {
        userId: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users', // references the 'Users' table
                key: 'id',
            }
        },
        recipeId: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Recipes', // references the 'Recipes' table
                key: 'id',
            }
        }
    }, {
        timestamps: false
    });

    return Favorite;
};