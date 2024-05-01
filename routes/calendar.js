const express = require('express');
const router = express.Router();
const Calendar = require('../models/calendar');

/**
 * GET route for displaying the calendar page.
 */
router.get('/', async (req, res, next) => {
  // Check if user is logged in
  if (!req.session.currentUser) {
    req.session.flash = {
      type: 'info',
      intro: 'Error!',
      message: 'You are not logged in',
    };
    res.redirect(303, '/');
    return;
  }

  // Retrieve the user ID from the session
  let userId = req?.session?.currentUser?.id;

  // Retrieve calendar dates for the logged-in user
  const calendarDates = await Calendar.getCommentDatesByUserId(userId);
  
  // Log the calendar dates for debugging
  console.log('calendarDates: ', calendarDates);

  // Render the calendar page with the retrieved calendar dates
  res.render('calendar/index', { title: 'Calendar', calendarDates: calendarDates });
});

module.exports = router;
