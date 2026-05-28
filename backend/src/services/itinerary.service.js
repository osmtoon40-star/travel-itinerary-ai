const Itinerary = require('../models/Itinerary.model');
const Document = require('../models/Document.model');
const mockService = require('./mock.service');
const { v4: uuidv4 } = require('uuid');
const AppError = require('../utils/AppError');

const generateFromDocument = async (documentId, userId, title = null) => {
  const document = await Document.findOne({ _id: documentId, userId });
  if (!document) {
    throw new AppError('Document not found', 404);
  }
  
  if (!document.extractedText) {
    throw new AppError('Document text not extracted yet', 400);
  }
  
  const itineraryData = await mockService.generateItinerary(document.extractedText);
  
  const itinerary = await Itinerary.create({
    userId,
    documentIds: [documentId],
    title: title || `Trip to ${itineraryData.destination || 'Unknown'}`,
    destination: itineraryData.destination,
    startDate: itineraryData.startDate ? new Date(itineraryData.startDate) : null,
    endDate: itineraryData.endDate ? new Date(itineraryData.endDate) : null,
    duration: itineraryData.duration,
    itineraryData: itineraryData
  });
  
  return itinerary;
};

const generateFromDocuments = async (documentIds, userId, title = null) => {
  const documents = await Document.find({ _id: { $in: documentIds }, userId });
  
  if (documents.length === 0) {
    throw new AppError('No valid documents found', 404);
  }
  
  let combinedText = '';
  for (const doc of documents) {
    if (doc.extractedText) {
      combinedText += `\n--- ${doc.originalName} ---\n${doc.extractedText}\n`;
    }
  }
  
  if (!combinedText.trim()) {
    throw new AppError('No extracted text found in documents', 400);
  }
  
  const itineraryData = await mockService.generateItinerary(combinedText);
  
  const itinerary = await Itinerary.create({
    userId,
    documentIds: documentIds,
    title: title || `Trip to ${itineraryData.destination || 'Unknown'}`,
    destination: itineraryData.destination,
    startDate: itineraryData.startDate ? new Date(itineraryData.startDate) : null,
    endDate: itineraryData.endDate ? new Date(itineraryData.endDate) : null,
    duration: itineraryData.duration,
    itineraryData: itineraryData
  });
  
  return itinerary;
};

const getUserItineraries = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  const itineraries = await Itinerary.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('title destination startDate endDate duration createdAt');
  
  const total = await Itinerary.countDocuments({ userId });
  
  return {
    itineraries,
    total,
    page,
    pages: Math.ceil(total / limit)
  };
};

const getItinerary = async (itineraryId, userId) => {
  const itinerary = await Itinerary.findOne({ _id: itineraryId, userId });
  
  if (!itinerary) {
    throw new AppError('Itinerary not found', 404);
  }
  
  return itinerary;
};

const deleteItinerary = async (itineraryId, userId) => {
  const result = await Itinerary.deleteOne({ _id: itineraryId, userId });
  
  if (result.deletedCount === 0) {
    throw new AppError('Itinerary not found', 404);
  }
  
  return true;
};

const generateShareLink = async (itineraryId, userId) => {
  const itinerary = await Itinerary.findOne({ _id: itineraryId, userId });
  
  if (!itinerary) {
    throw new AppError('Itinerary not found', 404);
  }
  
  if (!itinerary.shareId) {
    itinerary.shareId = uuidv4();
  }
  
  itinerary.isPublic = true;
  await itinerary.save();
  
  return {
    shareId: itinerary.shareId,
    shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/shared/${itinerary.shareId}`
  };
};

const getPublicItinerary = async (shareId) => {
  const itinerary = await Itinerary.findOne({ shareId, isPublic: true });
  
  if (!itinerary) {
    throw new AppError('Itinerary not found or not shared', 404);
  }
  
  itinerary.viewCount += 1;
  await itinerary.save();
  
  return itinerary;
};

module.exports = {
  generateFromDocument,
  generateFromDocuments,
  getUserItineraries,
  getItinerary,
  deleteItinerary,
  generateShareLink,
  getPublicItinerary
};