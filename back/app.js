const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const db = require('./model/db');

const bodyParser = require('body-parser');

const userRouter = require('./routes/user');
const articlesRouter = require('./routes/articles');
const categoryRouter = require('./routes/category');
const authRouter = require('./routes/auth');
const imageRouter = require('./routes/image');
const nodeRouter = require('./routes/node');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/images', express.static(__dirname + '/data/images/'));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  next();
});

app.use((err, req, res, next) => {
  console.error(err);

  if (err && err.name && err.name === 'ValidationError') {
    let errorData = { statusCode: 400, message: '' };
    let validationKey = Object.keys(err.errors);
    validationKey.forEach((key) => {
      errorData.message =
        errorData.message.concat(err.errors[key].message) + ' ';
    });
    res.status(errorData.statusCode).send(errorData);
  }

  let errorData = {
    statusCode: (err && err.statusCode < 500 && err.statusCode) || 500,
    message:
      (err && err.statusCode < 500 && err.message) || 'Internal server error',
  };

  res.status(errorData.statusCode).send(errorData);
});

app.use('/api/category', categoryRouter);
app.use('/api/node', nodeRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/image', imageRouter);

module.exports = app;
