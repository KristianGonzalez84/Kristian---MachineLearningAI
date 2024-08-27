module.exports = (sequelize, Sequelize) => {
    const RecentActivity = sequelize.define('RecentActivity', {
        userId: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            }
        },
        activity: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        },
        timestamp: {
            type: Sequelize.DataTypes.DATE,
            defaultValue: Sequelize.NOW,
        }
    }, {
        timestamps: false
    });

    return RecentActivity;
};