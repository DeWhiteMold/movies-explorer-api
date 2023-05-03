const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const AlreadyExist = require('../errors/AlreadyExist');

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new NotFound('Пользователь с указанным _id не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findOne({ email })
    .then((userWithEmail) => {
      if (userWithEmail) {
        next(new AlreadyExist('Пользователь с данным email уже существует'));
      } else {
        User.findByIdAndUpdate(
          req.user._id,
          { name, email },
          {
            new: true,
            runValidators: true,
          },
        )
          .then((user) => {
            if (!user) {
              throw new NotFound('Пользователь с указанным _id не найден');
            } else {
              res.send({ data: user });
            }
          })
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
