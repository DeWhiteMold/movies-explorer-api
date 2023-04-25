const Movie = require('../models/movie');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const { country, director, duration, year, description, image, trailerLink, nameRU, nameEN, thumbnail, movieId } = req.body;
  const owner = req.user._id;
  Movie.create({ 
    country, director, duration, year, description, image, trailerLink, nameRU, nameEN, thumbnail, movieId, owner 
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
  // Movie.findByIdAndRemove(req.params.movieId)
  //   .then((movie) => {
  //     if (!movie) {
  //       throw new NotFound('Фильм с указанным id не найден');
  //     } else {
  //       res.status(200).send({ data: movie})
  //     }
  //   })
  //   .catch((err) => {
  //     if (err.name === 'CastError') {
  //       next(new BadRequest('Переданы некорректные данные'));
  //     } else {
  //       next(err);
  //     }
  //   });
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFound('Фильм с указанным id не найден');
      } else if (movie.owner.toString() !== req.user._id) {
        throw new Forbidden('Вы не можете удалить этот фильм');
      } else {
        movie.deleteOne()
          .then(() => {
            res.status(200).send({ data: movie });
          })
          .catch(next);
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