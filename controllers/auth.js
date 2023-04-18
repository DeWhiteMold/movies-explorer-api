const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const AlreadyExist = require('../errors/AlreadyExist');
const AuthError = require('../errors/AuthError');

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, email, password: hash,
      })
        .then((user) => {
          if (user) {
            res.send({
              data: {
                name, email,
              },
            });
          }
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new AlreadyExist('Пользователь уже существует'));
          } else if (err.name === 'ValidationError') {
            next(new BadRequest('Переданы некорректные данные'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильный email или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((isValidPassword) => {
          if (!isValidPassword) {
            throw new AuthError('Неправильный email или пароль');
          }

          const { JWT_SECRET, NODE_ENV } = process.env;
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secret-token', { expiresIn: '7d' });

          return res.status(200).send({ token });
        })
        .catch(next);
    })
    .catch(next);
};