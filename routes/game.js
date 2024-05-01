const express = require('express');
const router = express.Router();
const Game = require('../models/game');
const Calendar = require('../models/calendar');
const Studio = require('../models/studio');

/**
 * GET route for displaying all games.
 */
router.get('/', async (req, res, next) => {
  const games = await Game.all();
  res.render('games/index', { title: 'Game Library || Games', games: games });
});

/**
 * GET route for displaying the game form.
 */
router.get('/form', async (req, res, next) => {
  res.render('games/form', { title: 'Game Library || Games' });
});

/**
 * POST route for adding a comment to a game.
 */
router.post('/comment', async (req, res, next) => {
  let gameId = req.body.id;
  let userId = req.user.id;
  let commentText = req.body.comment;
  await Game.addComment(gameId, userId, commentText);
  res.redirect(303, `/games/edit?id=${gameId}`);
});

/**
 * GET route for displaying the game edit form.
 */
router.get('/edit', async (req, res, next) => {
  let gameId = req.query.id;
  let game = await Game.get(gameId);
  let comments = await Game.getComments(gameId);
  res.render('games/form', { title: 'Game Library || Games', game: game, comments: comments });
});

/**
 * POST route for adding or updating a game.
 */
router.post('/upsert', async (req, res, next) => {
  console.log('req.body: ', req.body);
  await Game.addGame(req.body);
  const comment = req.body.comment;
  const gameId = req?.body?.id;
  let userId = req?.session?.currentUser ? req?.session?.currentUser.id : null;
  await Game.addComment(gameId, userId, comment);
  if (req?.body?.id && req.body.studio) {
    await Studio.linkGame(req.body.id, req.body.studio);
  }
  let createdOrUpdated = req?.body?.id ? 'updated' : 'created';
  req.session.flash = {
    type: 'info',
    intro: 'Success!',
    message: `The game has been ${createdOrUpdated}!`,
  };
  res.redirect(303, '/games');
});

module.exports = router;
