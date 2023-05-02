const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const NotFound = require('./errors/NotFound');
require('dotenv').config();

const app = express();
const { PORT = 3000, NODE_ENV, DB_PORT } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(NODE_ENV === 'production' ? DB_PORT : 'mongodb://127.0.0.1:27017/bitfilmsdb');

app.use(requestLogger);

app.use(cors);

app.use('/', require('./routes/auth'));

app.use(require('./middlewares/auth'));

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.all('*', (req, res, next) => { next(new NotFound('no such URL')); });

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(500).send({ message: 'Произошла ошибка на сервере' });
  }
  next();
});

app.listen(PORT, console.log('ok'));
