const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); 
app.use(express.json());

// The API key is securely loaded from your .env file
const apiKey = process.env.OPENROUTER_API_KEY;

app.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body; 

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch AI response' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));