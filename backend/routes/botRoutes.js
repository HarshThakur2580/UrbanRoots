const express = require('express');
const router = express.Router();

// @route   POST /api/bot/chat
// @desc    Chat with AI Bot for Gardening using Mistral or Groq
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    const systemPrompt = 'You are a helpful, expert assistant specifically focused on gardening, urban farming, and plant care. Answer questions concisely and in a friendly manner. If the user asks non-gardening questions, gently guide them back to gardening topics.';

    // Mistral API
    const mistralKey = process.env.MISTRAL_API_KEY;
    if (!mistralKey || mistralKey === 'your_mistral_api_key_here') {
      return res.status(500).json({ message: 'AI API key not configured. Please set MISTRAL_API_KEY in environment variables.' });
    }

    const mistralRes = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mistralKey}`
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.5,
        max_tokens: 1024
      })
    });

    const mistralData = await mistralRes.json();
    if (!mistralRes.ok) {
      console.error('Mistral error:', mistralData);
      return res.status(500).json({ message: mistralData.error?.message || 'AI request failed' });
    }

    res.json({ reply: mistralData.choices[0]?.message?.content || 'No response generated.' });

  } catch (error) {
    console.error('Bot Error:', error);
    res.status(500).json({ message: error.message || 'Failed to contact AI service' });
  }
});

module.exports = router;
