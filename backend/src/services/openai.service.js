const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateItinerary = async (extractedText) => {
  try {
    const prompt = `You are a travel assistant. Extract travel booking details from this text and create a day-by-day itinerary.

Extracted text from documents:
${extractedText}

Return ONLY valid JSON in this exact format (no other text outside JSON):
{
  "destination": "city name",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "duration": number of days,
  "summary": "brief overview of the trip",
  "dailyItinerary": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "time": "09:00",
          "activity": "activity name",
          "location": "place name",
          "notes": "helpful tips"
        }
      ]
    }
  ],
  "tips": ["tip 1", "tip 2", "tip 3"],
  "weather": "expected weather condition",
  "packingSuggestions": ["item1", "item2", "item3"]
}

If information is missing, make reasonable suggestions based on the destination.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a travel planning assistant. Extract information and create detailed itineraries. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    let content = response.choices[0].message.content;
    
    // Clean the response
    content = content.trim();
    if (content.startsWith('```json')) {
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    if (content.startsWith('```')) {
      content = content.replace(/```\n?/g, '');
    }
    
    const itinerary = JSON.parse(content);
    return itinerary;
    
  } catch (err) {
    console.error('OpenAI API error:', err.message);
    throw new Error('Failed to generate itinerary: ' + err.message);
  }
};

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
  "company": "company name"
}

If not found, use null. Only return JSON.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Extract travel booking information. Return valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    let content = response.choices[0].message.content;
    content = content.trim();
    if (content.startsWith('```json')) {
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    
    return JSON.parse(content);
    
  } catch (err) {
    console.error('Extraction error:', err.message);
    return null;
  }
};

module.exports = {
  generateItinerary,
  extractBookingInfo
};