const axios = require('axios');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const generateItinerary = async (extractedText) => {
  try {
    const prompt = `You are a travel assistant. Extract travel booking details from this text and create a day-by-day itinerary.

Extracted text from documents:
${extractedText}

Return ONLY valid JSON in this exact format:
{
  "destination": "city name",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "duration": number of days,
  "summary": "brief overview",
  "dailyItinerary": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "time": "09:00",
          "activity": "activity name",
          "location": "place name",
          "notes": "tips"
        }
      ]
    }
  ],
  "tips": ["tip1", "tip2"],
  "weather": "expected weather",
  "packingSuggestions": ["item1", "item2"]
}`;

    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a travel planning assistant. Return valid JSON only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    let content = response.data.choices[0].message.content;
    content = content.trim();
    if (content.startsWith('```json')) {
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    
    return JSON.parse(content);
  } catch (err) {
    console.error('OpenRouter error:', err.response?.data || err.message);
    throw new Error('Failed to generate itinerary');
  }
};

module.exports = { generateItinerary };