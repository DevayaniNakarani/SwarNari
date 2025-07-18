const express = require('express');
const router = express.Router(); // ✅ This line was missing!
const { detectIntent } = require('../services/dialogflow');
const { translateText } = require('../services/translate'); // Optional, if you're using translation


router.post('/', async (req, res) => {
  const { message } = req.body;

  try {
    const reply = await detectIntent(message, 'en');
    res.json({ reply });
  } catch (error) {
    console.error('Dialogflow Error:', error);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

module.exports = router;
