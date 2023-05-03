const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { updateUser, getCurrentUser } = require('../controllers/users');

router.get('/me', getCurrentUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email({ tlds: { allow: false } }),
  }),
}), updateUser);

module.exports = router;
