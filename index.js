const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');
require('dotenv-safe').config();

const app = express();

/** App config */
app.use(morgan('dev'));
app.use(helmet.noSniff());
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // pegar POSTS mais tarde

/** Headers */
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  next();
});

/** Home */
app.use(express.static(path.join(__dirname, 'public')));

/** Rotas */
app.use('/', require('./router'));

if (process.env.NODE_ENV !== 'production') {
  process.once('uncaughtException', function (err) {
    console.error('FATAL: Uncaught exception Final do Server: ' + new Date);
    console.error(err.stack || err);
    setTimeout(function () {
      process.exit(1);
    }, 100);
  });
}

app.listen(21102, function () {
  console.log('Example app listening on port 21102 :) ' + new Date);
});
