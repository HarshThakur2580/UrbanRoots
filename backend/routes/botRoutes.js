const express = require('express');
const router = express.Router();

// @route   POST /api/bot/chat
// @desc    Chat with AI Bot for Gardening using Mistral or Groq
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    const systemPrompt = 'You are a helpful, expert assistant specifically focused on gardening, urban farming, and plant care. Answer questions concisely and in a friendly manner. If the user asks non-gardening questions, gently guide them back to gardening topics.';

    // Try Mistral first if key is set and not placeholder
    const mistralKey = process.env.MISTRAL_API_KEY;
    if (mistralKey && mistralKey !== 'your_mistral_api_key_here') {
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
      if (mistralRes.ok) {
        return res.json({ reply: mistralData.choices[0]?.message?.content || 'No response.' });
      }
      console.warn('Mistral failed:', mistralData);
    }

    // Fallback: Groq API (free, fast)
    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      return res.status(500).json({ message: 'No AI API key configured. Please set MISTRAL_API_KEY or GROQ_API_KEY in .env' });
    }

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.5,
        max_tokens: 1024
      })
    });

    const groqData = await groqRes.json();
    if (!groqRes.ok) {
      console.error('Groq error:', groqData);
      return res.status(500).json({ message: groqData.error?.message || 'AI request failed' });
    }

    res.json({ reply: groqData.choices[0]?.message?.content || 'No response generated.' });

  } catch (error) {
    console.error('Bot Error:', error);
    res.status(500).json({ message: error.message || 'Failed to contact AI service' });
  }
});

module.exports = router;
