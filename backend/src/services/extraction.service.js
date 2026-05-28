const fs = require('fs').promises;
const pdfParse = require('pdf-parse');
const Document = require('../models/Document.model');
const AppError = require('../utils/AppError');

// Extract text from PDF file
const extractTextFromPDF = async (filePath) => {
  try {
    // Read the PDF file from disk
    const dataBuffer = await fs.readFile(filePath);
    
    // Parse PDF to get text
    const pdfData = await pdfParse(dataBuffer);
    
    // pdfData contains:
    // - text: all the text from PDF
    // - numpages: number of pages
    // - info: PDF metadata
    
    return {
      text: pdfData.text,
      pages: pdfData.numpages,
      info: pdfData.info
    };
  } catch (err) {
    console.log('PDF parse error:', err.message);
    throw new AppError('Failed to extract text from PDF', 500);
  }
};

// Process document and extract text
const processDocument = async (documentId, userId) => {
  // Find document in database
  const document = await Document.findOne({ _id: documentId, userId });
  
  if (!document) {
    throw new AppError('Document not found', 404);
  }
  
  // Update status to processing
  document.status = 'processing';
  await document.save();
  
  try {
    // Extract text based on file type
    let extractedText = '';
    
    if (document.fileType === 'pdf') {
      const result = await extractTextFromPDF(document.filePath);
      extractedText = result.text;
    } else {
      // For images, we'll handle later with OCR
      throw new AppError('Image OCR not implemented yet', 501);
    }
    
    // Update document with extracted text
    document.extractedText = extractedText;
    document.status = 'completed';
    await document.save();
    
    return {
      id: document._id,
      text: extractedText.substring(0, 500), // Return first 500 chars for preview
      fullLength: extractedText.length,
      status: 'completed'
    };
    
  } catch (err) {
    document.status = 'failed';
    await document.save();
    throw err;
  }
};

// Get extracted text from document
const getExtractedText = async (documentId, userId) => {
  const document = await Document.findOne({ _id: documentId, userId });
  
  if (!document) {
    throw new AppError('Document not found', 404);
  }
  
  if (!document.extractedText) {
    throw new AppError('Text not extracted yet', 400);
  }
  
  return {
    text: document.extractedText,
    status: document.status,
    fileName: document.originalName
  };
};

module.exports = {
  extractTextFromPDF,
  processDocument,
  getExtractedText
};