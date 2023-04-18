const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, Joi, celebrate } = require('celebrate');

const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/dfilmsbd');

app.listen(PORT, console.log('ok'));