import express from 'express';

const app = express.Router();

export {app as routes};

app.get('/', (request, res)=> res.send('Hello World'));

app.get('/users', (request, res)=> res.send([]));

app.post('/sendMessage', (request, res) => res.send({body: request.body}));