const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { uploadSingle, handleUploadError } = require('../middleware/upload.middleware');
const uploadController = require('../controllers/upload.controller');

// All routes require authentication
router.use(protect);

// Upload file
router.post(
  '/', 
  uploadSingle,      // Multer middleware
  handleUploadError, // Handle multer errors
  uploadController.uploadDocument
);

// Get all documents
router.get('/', uploadController.getDocuments);

// Get single document
router.get('/:id', uploadController.getDocument);

// Delete document
router.delete('/:id', uploadController.deleteDocument);

module.exports = router;