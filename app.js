require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const cron = require('node-cron');

var indexRouter = require('./routes/index');
const recipesRouter = require('./routes/recipes');
const searchRouter = require('./routes/search');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const profileRouter = require('./routes/profile');
const todaysRecommendationsRoutes = require('./routes/todaysRecommendations');
const logoutRouter = require('./routes/logout');

// Import the recommendation service
const generateAndSaveRecommendations = require('./services/recommendationService');

var db = require('./models');
console.log('Synchronizing database...');
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database & tables created!');
    
    // Schedule the cron job to generate and save daily recommendations at midnight
    cron.schedule('0 0 * * *', async () => {
      await generateAndSaveRecommendations();
      console.log('Daily recommendations generated and saved.');
    });

  })
  .catch(err => {
    console.error('Unable to sync database:', err);
  });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.use('/', indexRouter);
app.use('/recipes', recipesRouter);
app.use('/search', searchRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/profile', profileRouter);
app.use('/todays-recommendations', todaysRecommendationsRoutes);
app.use('/logout', logoutRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;