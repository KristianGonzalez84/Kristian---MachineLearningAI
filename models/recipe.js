module.exports = (sequelize, Sequelize) => {
    const Recipe = sequelize.define('Recipe', {
        title: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        },
        ingredients: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: false
        },
        steps: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: false
        }
    }, {
        timestamps: false
    });
    return Recipe;
};