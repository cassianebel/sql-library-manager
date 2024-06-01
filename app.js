var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var booksRouter = require('./routes/books');

const { sequelize } = require('./models/index');

var app = express();

(async () => {
  // sync all tables
  await sequelize.sync();
  // test the connection
  await sequelize.authenticate();
  console.log('Connection to the database successful!');
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', booksRouter);

// test error handling
  // app.get('/error', (req, res, next) => {
  //   const error = new Error();
  //   error.status = 500;
  //   next(error);
  // });

// catch 404 
app.use(function(req, res, next) {
  const err = new Error('Page Not Found');
  err.status = 404;
  err.message = "Sorry! We couldn't find the page you were looking for.";
  res.render('page-not-found', { err });
});

// error handler
app.use(function(err, req, res, next) {
  err.status = err.status || 500;
  err.message = err.message || "Sorry! There was an unexpected error on the server.";
  console.error(err.status, err.message);

  res.render('error', { err });
});

module.exports = app;
