const itineraryService = require('../services/itinerary.service');
const catchAsync = require('../utils/catchAsync');

// Generate from single document
const generateFromDocument = catchAsync(async (req, res) => {
  const { documentId } = req.body;
  const { title } = req.body;
  
  const itinerary = await itineraryService.generateFromDocument(
    documentId,
    req.user.id,
    title
  );
  
  res.status(201).json({
    success: true,
    message: 'Itinerary generated successfully',
    data: itinerary
  });
});

// Generate from multiple documents
const generateFromDocuments = catchAsync(async (req, res) => {
  const { documentIds, title } = req.body;
  
  if (!documentIds || documentIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Please provide at least one document ID'
    });
  }
  
  const itinerary = await itineraryService.generateFromDocuments(
    documentIds,
    req.user.id,
    title
  );
  
  res.status(201).json({
    success: true,
    message: 'Itinerary generated successfully',
    data: itinerary
  });
});

// Get all user itineraries
const getUserItineraries = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  const result = await itineraryService.getUserItineraries(req.user.id, page, limit);
  
  res.status(200).json({
    success: true,
    data: result
  });
});

// Get single itinerary
const getItinerary = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  const itinerary = await itineraryService.getItinerary(id, req.user.id);
  
  res.status(200).json({
    success: true,
    data: itinerary
  });
});

// Delete itinerary
const deleteItinerary = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  await itineraryService.deleteItinerary(id, req.user.id);
  
  res.status(200).json({
    success: true,
    message: 'Itinerary deleted successfully'
  });
});

// Generate share link
const generateShareLink = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  const result = await itineraryService.generateShareLink(id, req.user.id);
  
  res.status(200).json({
    success: true,
    message: 'Share link generated',
    data: result
  });
});

// Get public itinerary (no auth needed)
const getPublicItinerary = catchAsync(async (req, res) => {
  const { shareId } = req.params;
  
  const itinerary = await itineraryService.getPublicItinerary(shareId);
  
  res.status(200).json({
    success: true,
    data: itinerary
  });
});

module.exports = {
  generateFromDocument,
  generateFromDocuments,
  getUserItineraries,
  getItinerary,
  deleteItinerary,
  generateShareLink,
  getPublicItinerary
};