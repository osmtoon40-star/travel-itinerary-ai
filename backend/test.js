require('dotenv').config();
const axios = require('axios');

async function test() {
  const API_KEY = process.env.OPENROUTER_API_KEY;
  
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "openai/gpt-3.5-turbo",  // This works for sure
        messages: [{ role: "user", content: "Say hello" }]
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log("SUCCESS:", response.data.choices[0].message.content);
  } catch (err) {
    console.log("ERROR:", err.response?.data?.error?.message || err.message);
  }
}

test();