const express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  bodyParser = require('body-parser'),
  io = require('socket.io')(server);

const config = require('./config/database');
// connect database
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(config.database, () => {
  console.log('Connected database...');
});
//
const logger = require('morgan');
const router = express.Router();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(logger('dev'));
//app.use('/api/v1', router);

// sub string method
const onmessage = require('./onmessage');

// Controller
const logmachine = require('./controllers/logMachine');
const setmachine = require('./controllers/setMachine');

server.listen(port);
console.log(`App Runs on ${port}`);

var mqtt = require('mqtt');
// mqttcore
// 123456
//port: 14539

// 17037
// vcniortv
// uKQSMOpZiih1
var options = {

  port: 17037,
  host: 'mqtt://m13.cloudmqtt.com',
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
  username: 'vcniortv',
  password: 'uKQSMOpZiih1',
  keepalive: 60,
  reconnectPeriod: 1000,
  protocolId: 'MQIsdp',
  protocolVersion: 3,
  clean: true,
  encoding: 'utf8'
}

var client = mqtt.connect('mqtt://m13.cloudmqtt.com', options);
var topictest = ['SEND', 'SETDEVICE','SETAPP'];
//var data;

client.on('connect', () => {
  console.log('connected');
  client.subscribe(topictest, () => {
    console.log('subscribe : ' + topictest);
  });

});



io.on('connection', (socket) => {

  console.log('a user connected  : ' + socket.id);

  //  socket.on('subscribe', function (data) {
  //  console.log('Subscribing to '+data.topic);
  //  socket.join(data.topic);
  //  client.subscribe(data.topic);
  //  });

  //  socket.on('publish', function (data) {
  //      console.log('Publishing to '+data.topic);
  //      client.publish(data.topic,data.payload);
  //  });


  socket.on('disconnect', function () {
    console.log('a user disconnected  : ' + socket.id);
  });

  // Receive message from App to server to device
  socket.on('SETAPP', (topic, payload) => {
    var message = onmessage.messageemit(payload);
    if (message.lost == 0) {
      console.log({ message: 'data lost' });
    } else {
      console.log(topic + " " + "check message: %j", message);
      client.publish(topic, message);
    }
  });

});


// Receive message from server to app
client.on('message', (topic, payload) => {
  console.log(topic + '=' + payload);
  if (topic == "SEND") {
    var message = onmessage.messagecomming(payload);
    if (message.lost == 0) {
      console.log({ message: 'data lost' });
    } else {
      console.log(topic + " " + "message: %j", message);
      logmachine.newlog(parseFloat(message.temperasure),
        parseFloat(message.humidity),
        parseFloat(message.hour),
        parseFloat(message.day),
        parseFloat(message.connected));
      io.emit('DeviceSend', {
        'temperature': message.temperasure,
        'humidity': message.humidity,
        'hour': message.hour,
        'day': message.day,
        'connect': message.connected
      });
    }
  }
  else if (topic == "SETDEVICE") {
    var message = onmessage.messagecommingSet(payload);
    if (message.lost == 0) {
      console.log({ message: 'data lost' });
    } else {
      console.log(topic + " " + "message: %j", message);
      setmachine.setdata(parseFloat(message.temperasure),
        parseFloat(message.humidity),
        parseFloat(message.hour),
        parseFloat(message.reset));
      io.emit('DeviceSet', {
        'temperature': message.temperasure,
        'humidity': message.humidity,
        'hour': message.hour
      });
    }
  }
});
