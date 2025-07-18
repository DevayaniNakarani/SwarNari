const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
require('dotenv').config(); // ✅ Load .env variables

const projectId = process.env.PROJECT_ID; // ✅ From .env file
const sessionClient = new dialogflow.SessionsClient();

async function detectIntent(message, languageCode) {
  const sessionId = uuid.v4();
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: languageCode || 'en',
      },
    },
  };

  const responses = await sessionClient.detectIntent(request);
  return responses[0].queryResult.fulfillmentText;
}

module.exports = { detectIntent };
