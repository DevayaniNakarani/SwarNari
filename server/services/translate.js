const axios = require('axios');

async function translateText(text, targetLang) {
  console.log(`Translating to: ${targetLang}`);

  try {
    const response = await axios.post(
      'https://translate.argosopentech.com/translate',
      {
        q: text,
        source: 'en',
        target: targetLang,
        format: 'text'
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Translated:', response.data.translatedText);
    return response.data.translatedText;
  } catch (error) {
    console.error('Translation error:', error.message);
    return text; // fallback to English
  }
}

module.exports = { translateText };
