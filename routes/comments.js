const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');

/**
 * Middleware function to handle unauthorized access.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} returnUrl - The URL to redirect to.
 */
function notAuthorized(req, res, returnUrl) {
  req.session.flash = {
    type: 'danger',
    intro: 'Error!',
    message: `You are not authorized to edit this comment!`,
  };
  res.redirect(303, returnUrl);
  return;
}

/**
 * GET route for displaying the comment edit form.
 */
router.get('/edit', async (req, res, next) => {
  let commentId = req.query.id;
  let comment = await Comment.get(commentId);
  // Check if the comment exists
  if (!comment) {
    return notAuthorized(req, res, `/books/show/${comment.bookId}`);
  }
  // Check if user is logged in
  if (!req.session.currentUser){
    return notAuthorized(req, res, `/`);
  }
  // Check if the user is authorized to edit the comment
  if (req.session.currentUser.id !== comment.userId){
    return notAuthorized(req, res, `/books/show/${comment.bookId}`);
  }
  // Render the comment edit form
  res.render('comments/form', { title: 'BookedIn || Genres', comment: comment });
});

/**
 * POST route for updating or inserting a comment.
 */
router.post('/upsert', async (req, res, next) => {
  console.log('body: ' + JSON.stringify(req.body));
  let comment = await Comment.get(req.body.id);
  // Check if the user is authorized to edit the comment
  if (req.session.currentUser.id !== comment.userId){
    return notAuthorized(req, res, `/books/show/${comment.bookId}`);
  }
  // Update or insert the comment
  await Comment.upsert(req.body);
  // Set flash message for success
  req.session.flash = {
    type: 'info',
    intro: 'Success!',
    message: `Your comment has been updated!`,
  };
  // Redirect to the book page
  res.redirect(303, `/books/show/${comment.bookId}`);
});

module.exports = router;
