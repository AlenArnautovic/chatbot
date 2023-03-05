import express from 'express';
import { Chatbot } from './chatbot/chatbotServer';
import {
  checkIfDoctorForDiseaseIsAvailable,
  executeInsert,
} from './database/snowflake';
import { ClientIdService } from './serverSupport/clientIdService';
import { encyptionService } from './serverSupport/encryptionService';

const app = express.Router();

export { app as routes };

app.post('/dialogflow/sendMessage', async (req, res) => {
  let text = req.body.message;
  text = encyptionService.decrypt(text);
  let userId = req.body.userId;
  userId = encyptionService.decrypt(userId);
  console.log(text);
  const resultQurey = await Chatbot.textQuery(text, userId);
  const chatbotTransportObject = Chatbot.createChatbotTransportObject(
    resultQurey,
    userId
  );
  const answer = encyptionService.encrypt(chatbotTransportObject);
  res.send({ answer: answer });
});

app.get('/registerClient', (req, res) => {
  let clientId = ClientIdService.registerNewClient();
  clientId = encyptionService.encrypt(clientId);
  res.send({ clientId: clientId });
});

app.post('/dialogflow/eventRequest', async (req, res) => {
  let eventName = req.body.message;
  eventName = encyptionService.decrypt(eventName);
  console.log(eventName);
  let userId = req.body.userId;
  userId = encyptionService.decrypt(userId);

  const resultQurey = await Chatbot.eventQuery(eventName, userId);

  const chatbotTransportObject = Chatbot.createChatbotTransportObject(
    resultQurey,
    userId
  );

  const answer = encyptionService.encrypt(chatbotTransportObject);
  res.send({ answer: answer });
});

app.post('/database/insert', async (req, res) => {
  const text = req.body.message;
  executeInsert();
});

app.post('/webhook', async (req, res) => {
  console.log(req.body);
  const body = req.body;
});
