const extractionService = require('../services/extraction.service');
const catchAsync = require('../utils/catchAsync');

// Process a document (extract text)
const processDocument = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  const result = await extractionService.processDocument(id, req.user.id);
  
  res.status(200).json({
    success: true,
    message: 'Document processed successfully',
    data: result
  });
});

// Get extracted text from a document
const getExtractedText = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  const result = await extractionService.getExtractedText(id, req.user.id);
  
  res.status(200).json({
    success: true,
    data: result
  });
});

// Quick extract without saving (for testing)
const quickExtract = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  const document = await Document.findOne({ _id: id, userId: req.user.id });
  if (!document) {
    throw new AppError('Document not found', 404);
  }
  
  // Just extract and return, don't save
  const result = await extractionService.extractTextFromPDF(document.filePath);
  
  res.status(200).json({
    success: true,
    data: {
      text: result.text.substring(0, 1000), // First 1000 chars
      totalLength: result.text.length,
      pages: result.pages
    }
  });
});

module.exports = {
  processDocument,
  getExtractedText,
  quickExtract
};