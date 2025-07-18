const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dialogflowRoutes = require('./routes/dialogflowRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Proper CORS configuration (no wildcard issues)
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/ask', dialogflowRoutes);

app.listen(PORT, () => {
  console.log(`✅ SakhiAI backend running at http://localhost:${PORT}`);
});
