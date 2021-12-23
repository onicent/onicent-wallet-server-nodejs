// const HttpException = require('./utilities/HttpException');
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';

const enableWS = require('express-ws');
const morgan = require('morgan');

import webConfig from './web.config.json';
import routes from './routes';

morgan.token('reqdata', (req, res) => {
  return JSON.stringify(req.method === 'POST' ? req.body : req.query);
});
//Set port for server
let port = webConfig.serverconfig.port || 3000;
// Init express
let app = express();

let url = webConfig.dbconfig.host + ':' + webConfig.dbconfig.port + '/' + webConfig.dbconfig.database;
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err) {  
    if (err) {
        console.log('Can not connect to the database!');
        throw err;
    }          
    console.log('Successfully connected mongodb url:' + url);
});

app.use(morgan(':method :url :status :reqdata :res[content-length] - :response-time ms'));
// parses incoming requests with JSON payloads
// app.use(express.json());
app.use(express.json({limit: '50mb'}));

// Set static folder
app.use('/public', express.static(path.join(__dirname, 'public')));
// app.use('/public/product', express.static(path.join(__dirname, 'public/product')));

// Enable pre-flight
app.use(cors({ origin: "https://localhost:3000"}));
app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept",
      "Access-Control-Allow-Origin"
    );
    next();
});

enableWS(app);

routes.routes(app, express.Router())
// 404 error
// app.all('*', function(req, res, next) {
//     const err = new HttpException(404, 'Endpoint Not Found','end'); 
//     res.status(404).send(err)
//     //next(err);
// });

// Error middleware
//app.use(errorMiddleware);

// starting the server
app.listen(port, function() { 
  console.log(`🚀 Server running on port ${port}!`)
});

