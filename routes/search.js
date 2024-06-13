const express = require('express');
const router = express.Router();
const db = require('../models');
const Recipe = db.Recipe;

router.get('/', async function(req, res, next) {
    res.render('search');
});

router.post('/', async function(req, res, next) {
    const keyword = req.body.keyword;
    try {
        const recipes = await db.Recipe.findAll({
            where: {
                title: {
                    [db.Sequelize.Op.like]: '%' + keyword + '%'
                }
            }
        });
        res.render('search', { recipes }); // Rendering search.ejs with search results
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;