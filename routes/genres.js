const express = require('express');
const router = express.Router();
const Genre = require('../models/genre');

/**
 * GET route for displaying all genres.
 */
router.get('/', async (req, res, next) => {
  const genres = await Genre.all();
  res.render('genres/index', { title: 'BookedIn || Genres', genres: genres });
});

/**
 * GET route for displaying the genre form.
 */
router.get('/form', async (req, res, next) => {
  res.render('genres/form', { title: 'BookedIn || Genres' });
});

/**
 * GET route for displaying the genre edit form.
 */
router.get('/edit', async (req, res, next) => {
  let genreId = req.query.id;
  let genre = await Genre.get(genreId);
  res.render('genres/form', { title: 'BookedIn || Genres', genre: genre });
});

/**
 * POST route for adding or updating a genre.
 */
router.post('/upsert', async (req, res, next) => {
  console.log('body: ' + JSON.stringify(req.body));
  await Genre.upsert(req.body);
  let createdOrUpdated = req.body.id ? 'updated' : 'created';
  req.session.flash = {
    type: 'info',
    intro: 'Success!',
    message: `The genre has been ${createdOrUpdated}!`,
  };
  res.redirect(303, '/genres');
});

module.exports = router;
