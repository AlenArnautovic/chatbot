import express from 'express';
import { Chatbot } from './chatbot/chatbotServer';

const app = express.Router();

export {app as routes};

app.get('/', (request, res)=> res.send('Hello World'));

app.get('/users', (request, res)=> res.send([]));

app.post('/sendMessage', (request, res) => res.send({body: request.body}));

app.post('/dialogflow/sendMessage', async(req, res)=>{
    const text = req.body.message;
    const userId = req.body.userId;
    const resultQurey = await Chatbot.textQuery(text,userId);
    res.send("dialogFlow Accepted");
})