const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const extractionController = require('../controllers/extraction.controller');

// All routes need authentication
router.use(protect);

// Process document (extract and save text)
router.post('/process/:id', extractionController.processDocument);

// Get extracted text from document
router.get('/text/:id', extractionController.getExtractedText);

// Quick extract preview (doesn't save to DB)
router.get('/preview/:id', extractionController.quickExtract);

module.exports = router;