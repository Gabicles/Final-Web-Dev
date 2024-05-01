const express = require('express');
const router = express.Router();
const Studio = require('../models/studio');

// Route to display all studios
router.get('/', async (req, res, next) => {
    // Retrieve all studios from the database
    const studios = await Studio.all();
    // Render the studios index view, passing the studios data to the view
    res.render('studios/index', { title: 'Studio Library || Studios', studios: studios });
});

// Route to display the studio form for adding a new studio
router.get('/form', async (req, res, next) => {
    // Render the studio form view
    res.render('studios/form', { title: 'Studio Library || Studios' });
});

// Route to display the studio form for editing an existing studio
router.get('/edit', async (req, res, next) => {
    // Retrieve the studio ID from the query parameters
    let studioId = req.query.id;
    // Retrieve the studio and its associated games from the database based on the ID
    let studio = await Studio.get(studioId);
    let games = await Studio.getGames(studioId);
    // Render the studio form view, passing the studio and games data to the view
    res.render('studios/form', { title: 'Studio Library || Studios', studio: studio, games: games });
});

// Route to add or update a studio
router.post('/upsert', async (req, res, next) => {
    // Add or update the studio in the database based on the form data
    await Studio.addStudio(req.body);
    // Determine if the operation was a creation or update
    let createdOrUpdated = req.body.id ? 'updated' : 'created';
    // Set a flash message indicating the success of the operation
    req.session.flash = {
        type: 'info',
        intro: 'Success!',
        message: `The studio has been ${createdOrUpdated}!`,
    };
    // Redirect to the studios index page
    res.redirect(303, '/studios');
});

module.exports = router;
