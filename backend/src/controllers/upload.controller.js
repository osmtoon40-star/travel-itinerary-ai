const uploadService = require('../services/upload.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Upload a single document
const uploadDocument = catchAsync(async (req, res) => {
  // Check if file exists
  if (!req.file) {
    throw new AppError('No file uploaded', 400);
  }
  
  // Save file info to database
  const document = await uploadService.saveFileInfo(
    req.user.id, // from auth middleware
    req.file
  );
  
  res.status(201).json({
    success: true,
    message: 'File uploaded successfully',
    data: {
      document: {
        id: document._id,
        fileName: document.fileName,
        originalName: document.originalName,
        fileType: document.fileType,
        fileSize: document.fileSize,
        uploadedAt: document.createdAt
      }
    }
  });
});

// Get all user documents
const getDocuments = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  const result = await uploadService.getUserDocuments(req.user.id, page, limit);
  
  res.status(200).json({
    success: true,
    data: result
  });
});

// Get single document
const getDocument = catchAsync(async (req, res) => {
  const document = await uploadService.getDocumentById(req.params.id, req.user.id);
  
  res.status(200).json({
    success: true,
    data: { document }
  });
});

// Delete document
const deleteDocument = catchAsync(async (req, res) => {
  await uploadService.deleteDocument(req.params.id, req.user.id);
  
  res.status(200).json({
    success: true,
    message: 'Document deleted successfully'
  });
});

module.exports = {
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDocument
};