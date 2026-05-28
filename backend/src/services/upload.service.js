const Document = require('../models/Document.model');
const fs = require('fs').promises;
const path = require('path');
const AppError = require('../utils/AppError');

// Save file info to database
const saveFileInfo = async (userId, file, extractedText = null) => {
  const document = await Document.create({
    userId,
    fileName: file.filename,
    originalName: file.originalname,
    filePath: file.path,
    fileType: file.mimetype.includes('pdf') ? 'pdf' : 'image',
    fileSize: file.size,
    mimeType: file.mimetype,
    extractedText: extractedText
  });
  
  return document;
};

// Get user's documents
const getUserDocuments = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit; // pagination logic
  
  const documents = await Document.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  
  const total = await Document.countDocuments({ userId });
  
  return {
    documents,
    total,
    page,
    pages: Math.ceil(total / limit)
  };
};

// Get single document by ID
const getDocumentById = async (documentId, userId) => {
  const document = await Document.findOne({ _id: documentId, userId });
  
  if (!document) {
    throw new AppError('Document not found', 404);
  }
  
  return document;
};

// Delete document and file
const deleteDocument = async (documentId, userId) => {
  const document = await Document.findOne({ _id: documentId, userId });
  
  if (!document) {
    throw new AppError('Document not found', 404);
  }
  
  // Delete file from disk
  try {
    await fs.unlink(document.filePath);
  } catch (err) {
    console.log('File not found on disk:', err.message);
  }
  
  // Delete from database
  await Document.deleteOne({ _id: documentId });
  
  return true;
};

// Update document with extracted text
const updateExtractedText = async (documentId, extractedText) => {
  const document = await Document.findByIdAndUpdate(
    documentId,
    { 
      extractedText: extractedText,
      status: 'completed'
    },
    { new: true }
  );
  
  return document;
};

module.exports = {
  saveFileInfo,
  getUserDocuments,
  getDocumentById,
  deleteDocument,
  updateExtractedText
};