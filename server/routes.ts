import express from 'express';
import { Chatbot } from './chatbot/chatbotServer';
import { ClientIdService } from './serverSupport/clientIdService';
// import { executeInsert } from './database/snowflake';

const app = express.Router();

export { app as routes };

app.post('/dialogflow/sendMessage', async (req, res) => {
  const text = req.body.message;
  const userId = req.body.userId;
  const resultQurey = await Chatbot.textQuery(text, userId);

  const chatbotTransportObject = Chatbot.createChatbotTransportObject(
    resultQurey,
    userId
  );
  res.send(chatbotTransportObject);
});

app.get('/registerClient', (req, res) => {
  const clientId = ClientIdService.registerNewClient();
  res.send({ clientId: clientId });
});

app.post('/dialogflow/eventRequest', async (req, res) => {
  const eventName = req.body.message;
  const userId = req.body.userId;
  console.log(eventName);
  const resultQurey = await Chatbot.eventQuery(eventName, userId);

  const chatbotTransportObject = Chatbot.createChatbotTransportObject(
    resultQurey,
    userId
  );
  res.send(chatbotTransportObject);
});

// app.post('/database/insert', async(req, res)=>{
//     const text = req.body.message;
//     executeInsert();
// });

app.post('/webhook', async (req, res) => {
  console.log(req.body);
  const body = req.body;
});
