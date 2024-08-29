const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
require('dotenv').config();

const connection = {
  dialect: process.env.DIALECT,
  database: process.env.DATABASE_NAME,
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
  host: process.env.HOST
};

// Connect to the database
const sequelize = new Sequelize(connection);

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Load models from files in the same directory
fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize);
    db[model.name] = model;
  });

// Define model associations
const { User, Recipe, Favorite, RecentActivity, TodaysRecommendation } = db;

User.hasMany(Favorite, { foreignKey: 'userId' });
Favorite.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(RecentActivity, { foreignKey: 'userId' });
RecentActivity.belongsTo(User, { foreignKey: 'userId' });

Recipe.hasMany(Favorite, { foreignKey: 'recipeId' });
Favorite.belongsTo(Recipe, { foreignKey: 'recipeId' });

// Associations for TodaysRecommendation
User.hasMany(TodaysRecommendation, { foreignKey: 'userId' });
TodaysRecommendation.belongsTo(User, { foreignKey: 'userId' });

Recipe.hasMany(TodaysRecommendation, { foreignKey: 'recipeId' });
TodaysRecommendation.belongsTo(Recipe, { foreignKey: 'recipeId' });

module.exports = db;