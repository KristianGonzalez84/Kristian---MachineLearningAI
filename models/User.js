module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        name: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        },
        username: { 
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: { // Keep this for now, as you will handle plain text passwords
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    return User;
};