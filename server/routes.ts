import express from 'express';
import { Chatbot } from './chatbot/chatbotServer';
import {
  createDatabase,
  insertTestData,
} from './database/controllers/database';
import { Database } from './database/controllers/databaseMain';
import { ClientIdService } from './serverSupport/clientIdService';
import { encyptionService } from './serverSupport/encryptionService';

/**
 * by Nicolai Haferkamp
 *
 * Based on: https://www.youtube.com/watch?v=Ad3fj9V7s6A
 */
const app = express.Router();
export { app as routes };

app.post('/dialogflow/sendMessage', async (req, res) => {
  let text = req.body.message;
  text = encyptionService.decrypt(text);
  let userId = req.body.userId;
  userId = encyptionService.decrypt(userId);
  console.log(text);
  const resultQurey = await Chatbot.textQuery(text, userId);
  const chatbotTransportObject = await Chatbot.createChatbotTransportObject(
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

  const chatbotTransportObject = await Chatbot.createChatbotTransportObject(
    resultQurey,
    userId
  );

  const answer = encyptionService.encrypt(chatbotTransportObject);
  res.send({ answer: answer });
});

/**
 * Database Methods
 */
app.post('/database/createDatabase', async (req, res) => {
  createDatabase();
});

app.post('/database/insertTestData', async (req, res) => {
  insertTestData();
});

app.post('/database/testDatabase', async (req, res) => {
  const methodId = req.body.message;
  switch (methodId) {
    case 1:
      Database.checkPatientsData('11112222');
      break;
    case 2:
      Database.checkIfPatientHasAppointmentForDisease('11112222', 'Back Pain');
      break;
    case 3:
      Database.checkIfDoctorForDiseaseIsAvailableForASpecificAppointment(
        'Back Pain',
        '2023-02-01 07:15:00'
      );
      break;
    case 4:
      Database.bookAppointment(
        '11112222',
        '2023-02-01 07:15:00',
        'Back Pain',
        'Something'
      );
      break;
    case 5:
      Database.addPatient(
        '11112222',
        'Lewis',
        'Hamilton',
        '2233002323',
        '1985-01-07',
        '3'
      );
      break;
    case 6:
      Database.checkIfAppointmentForDiseaseIsAvailable(
        'Back Pain',
        '2023-02-01 07:15:00'
      );
      break;
    default:
      break;
  }
});
