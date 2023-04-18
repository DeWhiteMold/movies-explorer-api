const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { login, createUser } = require('../controllers/auth');

router.post('/singup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), login);

module.exports = router;