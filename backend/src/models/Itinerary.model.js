const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  documentIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  title: {
    type: String,
    default: 'My Travel Plan'
  },
  destination: {
    type: String
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  duration: {
    type: Number
  },
  itineraryData: {
    type: Object,
    required: true
  },
  shareId: {
    type: String,
    unique: true,
    sparse: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create index for faster queries
itinerarySchema.index({ userId: 1, createdAt: -1 });
itinerarySchema.index({ shareId: 1 });

module.exports = mongoose.model('Itinerary', itinerarySchema);