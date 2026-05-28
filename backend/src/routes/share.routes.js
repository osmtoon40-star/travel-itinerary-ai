const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itinerary.controller');

// Public route - no authentication needed
router.get('/:shareId', itineraryController.getPublicItinerary);

module.exports = router;