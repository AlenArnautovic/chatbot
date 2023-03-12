import express from 'express';
import { Chatbot } from './chatbot/chatbotServer';
import {
  checkPatientsData,
  checkIfPatientHasAppointmentForDisease,
  checkIfPatientHasAppointmentAtTime,
  checkIfDoctorForDiseaseIsAvailable,
  checkIfDoctorForDiseaseIsAvailableForASpecificAppointment,
  getInformationOfAppointment,
  bookAppointment,
  changeAppointment,
  deleteAppointment,
  addPatient,
} from './database/controllers/patient';
import {
  createDatabase,
  insertTestData,
} from './database/controllers/database';
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

// //Api endpoints Database
app.post('/database/insert', async (req, res) => {
  const text = req.body.message;
  //createPatients(req,res);
});

app.get('/database/getPatient', async (req, res) => {
  const text = req.body.message;
  //getAllPatients(req, res);
});

app.post('/database/createDatabase', async (req, res) => {
  const text = req.body.message;
  createDatabase(req, res);
});

app.post('/database/insertTestData', async (req, res) => {
  const text = req.body.message;
  insertTestData(req, res);
});

app.post('/database/checkPatientsData', async (req, res) => {
  const birthdate = req.body.birthdate;
  const prename = req.body.prename;
  const lastname = req.body.lastname;
  const vNumber = req.body.vNumber;
  checkPatientsData(birthdate, prename, lastname, vNumber);
});

app.post(
  '/database/checkIfPatientHasAppointmentForDisease',
  async (req, res) => {
    const vNumber = req.body.vNumber;
    const disease = req.body.disease;
    checkIfPatientHasAppointmentForDisease(vNumber, disease);
  }
);

app.post('/database/checkIfPatientHasAppointmentAtTime', async (req, res) => {
  const vNumber = req.body.vNumber;
  const appointment = req.body.appointment;
  checkIfPatientHasAppointmentAtTime(vNumber, appointment);
});

app.post('/database/checkIfDoctorForDiseaseIsAvailable', async (req, res) => {
  const disease = req.body.disease;
  checkIfDoctorForDiseaseIsAvailable(disease);
});

app.post(
  '/database/checkIfDoctorForDiseaseIsAvailableForASpecificAppointment',
  async (req, res) => {
    const disease = req.body.disease;
    const appointment = req.body.appointment;
    checkIfDoctorForDiseaseIsAvailableForASpecificAppointment(
      disease,
      appointment
    );
  }
);

app.post('/database/getInformationOfAppointment', async (req, res) => {
  const vNumber = req.body.vNumber;
  const appointment = req.body.appointment;
  getInformationOfAppointment(vNumber, appointment);
});

app.post('/database/bookAppointment', async (req, res) => {
  const vNumber = req.body.vNumber;
  const appointment = req.body.appointment;
  const disease = req.body.disease;
  const symptoms = req.body.symptoms;
  bookAppointment(vNumber, appointment, disease, symptoms);
});

app.post('/database/changeAppointment', async (req, res) => {
  const vNumber = req.body.vNumber;
  const disease = req.body.disease;
  const oldAppointment = req.body.oldAppointment;
  const newAppointment = req.body.newAppointment;

  changeAppointment(vNumber, disease, oldAppointment, newAppointment);
});

app.post('/database/deleteAppointment', async (req, res) => {
  const vNumber = req.body.vNumber;
  const appointment = req.body.appointment;
  deleteAppointment(vNumber, appointment);
});

app.post('/database/addPatient', async (req, res) => {
  const vNumber = req.body.vNumber;
  const preName = req.body.preName;
  const lastName = req.body.lastName;
  const phone = req.body.phone;
  const birthdate = req.body.birthdate;
  const address_ID = req.body.address_ID;
  addPatient(vNumber, preName, lastName, phone, birthdate, address_ID);
});
