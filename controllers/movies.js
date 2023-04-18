const Movie = require('../models/movie');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const { country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId } = req.body;
  const owner = req.user._id;
  Movie.create({ 
    country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId, owner 
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findByIdAndRemove(req.params.cardId)
    .then((movie) => {
      if (!movie) {
        throw new NotFound('Фильм с указанным _id не найден');
      } else {
        res.status(200).send({ data: movie})
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};