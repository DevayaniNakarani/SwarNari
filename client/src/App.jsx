import { useState, useEffect } from 'react';
import './App.css';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [language, setLanguage] = useState('hi-IN');
  const [isListening, setIsListening] = useState(false);
  const [voices, setVoices] = useState([]);

  // Load available voices once
  useEffect(() => {
    const loadVoices = () => {
      const synthVoices = window.speechSynthesis.getVoices();
      setVoices(synthVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // 🎤 Voice input
  const startListening = () => {
    if (!SpeechRecognition) {
      alert("Your browser doesn't support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuestion(transcript);
      setIsListening(false);
    };

    recognition.onerror = (e) => {
      console.error('Mic error:', e.error);
      alert('Microphone error: ' + e.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  // 🔊 Speak reply aloud
  const speakText = (text, langCode) => {
    const utterance = new SpeechSynthesisUtterance(text);

    let voice = null;

    if (langCode === 'hi-IN') {
      voice = voices.find(v => v.name.includes('Madhur') || v.name.includes('Swara')) || voices.find(v => v.lang === 'hi-IN');
    } else if (langCode === 'gu-IN') {
      voice = voices.find(v => v.name.includes('Dhwani') || v.name.includes('Niranjan')) || voices.find(v => v.lang === 'gu-IN');
    } else {
      voice = voices.find(v => v.lang === 'en-IN') || voices.find(v => v.lang.startsWith('en'));
    }

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
      console.log('🎤 Speaking with:', voice.name, voice.lang);
    } else {
      utterance.lang = langCode;
      console.warn('⚠️ No matching voice found, using default lang:', langCode);
    }

    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  // 🛑 Stop voice
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
  };

  // 🤖 Send message to SakhiAI backend
  const handleSubmit = async () => {
    if (!question.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question, language }),
      });

      const data = await response.json();
      setAnswer(data.reply);
      speakText(data.reply, language);
    } catch (err) {
      console.error('Error:', err);
      setAnswer('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="app-container">
      <h1>🌸 SwarNari- Empower Her, Inform Her</h1>

      <div className="input-section">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="language-select"
        >
        <option value="en-IN">English </option>
          <option value="hi-IN">Hindi 🇮🇳</option>
          <option value="gu-IN">Gujarati 🇮🇳</option>
          
        </select>

        <textarea
          placeholder="Type your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        ></textarea>

        <div className="button-group">
          <button onClick={handleSubmit}>💬 Ask SakhiAI</button>
          <button onClick={startListening}>
            {isListening ? '🎤 Listening...' : '🎙️ Speak Question'}
          </button>
        </div>
      </div>

      {answer && (
        <div className="response-box">
          <p>{answer}</p>
          <div className="button-group">
            <button onClick={() => speakText(answer, language)}>🔈 Speak Reply</button>
            <button onClick={stopSpeaking} className="stop">🛑 Stop</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
