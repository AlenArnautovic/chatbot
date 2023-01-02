import express from 'express';
import {routes} from './routes';

const app = express();

app.use((request, res, next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    if('OPTIONS' == request.method) {
        res.sendStatus(200);
    }else{
        console.log(`${request.ip} ${request.method} ${request.url}`);
        next();
    }
});

app.use(express.json());

app.use('/',routes);

app.listen(4245, '127.0.0.1', function(){
    console.log('Server now listening on 4245');
});