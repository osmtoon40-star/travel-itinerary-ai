const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Generate itinerary from extracted text
const generateItinerary = async (extractedText, userPreferences = {}) => {
  try {
    // Create prompt for Gemini
    const prompt = `
You are a travel assistant. Extract travel booking details from this text and create a day-by-day itinerary.

Extracted text from documents:
${extractedText}

Return ONLY valid JSON in this exact format:
{
  "destination": "city name",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "duration": number of days,
  "bookings": {
    "flights": [
      {
        "airline": "airline name",
        "flightNumber": "number",
        "from": "city",
        "to": "city",
        "departure": "YYYY-MM-DD HH:MM",
        "arrival": "YYYY-MM-DD HH:MM"
      }
    ],
    "hotels": [
      {
        "name": "hotel name",
        "checkIn": "YYYY-MM-DD",
        "checkOut": "YYYY-MM-DD",
        "address": "address"
      }
    ],
    "transport": [
      {
        "type": "train/bus/car",
        "from": "city",
        "to": "city",
        "date": "YYYY-MM-DD"
      }
    ]
  },
  "dailyItinerary": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "time": "09:00",
          "activity": "activity name",
          "location": "place name",
          "notes": "additional info"
        }
      ],
      "meals": {
        "breakfast": "place or note",
        "lunch": "place or note",
        "dinner": "place or note"
      }
    }
  ],
  "tips": ["tip 1", "tip 2", "tip 3"],
  "weather": "expected weather condition",
  "packingSuggestions": ["item1", "item2"]
}

If information is missing, use "Not specified" or make reasonable suggestions based on destination.
Do not add any text outside the JSON. Only return valid JSON.`;

    // Call Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response (remove markdown if present)
    let cleanJson = text.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/```\n?/g, '');
    }
    
    // Parse JSON
    const itinerary = JSON.parse(cleanJson);
    
    return itinerary;
    
  } catch (err) {
    console.log('Gemini API error:', err.message);
    throw new Error('Failed to generate itinerary: ' + err.message);
  }
};

// Simple text extraction to structured data
const extractBookingInfo = async (extractedText) => {
  try {
    const prompt = `
Extract travel booking information from this text. Return ONLY valid JSON.

Text:
${extractedText}

Format:
{
  "bookingReference": "reference number if found",
  "passengerName": "name of passenger",
  "type": "flight/hotel/train/bus",
  "from": "departure location",
  "to": "arrival location",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "company": "airline/hotel/train company name",
  "confirmationNumber": "number if found"
}

If not found, use null. Only return JSON.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    let cleanJson = text.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    
    return JSON.parse(cleanJson);
    
  } catch (err) {
    console.log('Extraction error:', err.message);
    return null;
  }
};

module.exports = {
  generateItinerary,
  extractBookingInfo
};