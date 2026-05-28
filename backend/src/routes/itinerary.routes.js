const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const itineraryController = require('../controllers/itinerary.controller');

router.use(protect);

// Frontend expects POST /generate (not /generate/single/:documentId)
router.post('/generate', itineraryController.generateFromDocument);

// Frontend expects GET /history
router.get('/history', itineraryController.getUserItineraries);

// Keep these as they are
router.get('/:id', itineraryController.getItinerary);
router.delete('/:id', itineraryController.deleteItinerary);
router.post('/:id/share', itineraryController.generateShareLink);

module.exports = router;