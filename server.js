//Dependencies
const express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  bodyParser = require('body-parser'),
  io = require('socket.io')(server);

// Config
const config = require('./config/config');

// Server Notification
const FCM = require('fcm-node');
const fcm = new FCM(config.serverKey);
//


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

// Mqtt Config
const mqtt = require('mqtt');
// mqttcore
// 123456
//port: 14539

// 17037
// vcniortv
// uKQSMOpZiih1
const options = {

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
//

const client = mqtt.connect('mqtt://m13.cloudmqtt.com', options);
const topictest = ['SEND', 'SETDEVICE', 'SETAPP'];
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


var timer = 1;


// Receive message from server to app
client.on('message', (topic, payload) => {
  console.log(topic + '=' + payload);
  if (topic == "SEND") {
    timer = 1;
    var message = onmessage.messagecomming(payload);
    if (message.lost == 0) {
      console.log({ message: 'data lost' });
    } else {
      console.log(topic + " " + "message: %j", message);

      fcm.send(messageNotification, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully sent with response: ");
        }
      });

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
      // setmachine.setdata(parseFloat(message.temperasure),
      //   parseFloat(message.humidity),
      //   parseFloat(message.hour),
      //   parseFloat(message.reset));
      io.emit('DeviceSet', {
        'temperature': message.temperasure,
        'humidity': message.humidity,
        'hour': message.hour
      });
    }
  }

}, msgOut);

var msgOut = setInterval(() => {
  console.log(timer);
  if (timer === 30) {
    logmachine.newlog(parseFloat(0.0),
      parseFloat(0),
      parseFloat(0),
      parseFloat(0),
      parseFloat(0));
    io.emit('DeviceSend', {
      'temperature': 0.0,
      'humidity': 0,
      'hour': 0,
      'day': 0,
      'connect': 0
    });
  }
  timer = timer + 1;
}, 1000);

var url = 'https://fcm.googleapis.com/fcm/send';
var messageNotification = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
  to: '1:605772801169:android:2858f4a0bedd3b3b', 
  priority:"high",
  notification: {
    title: 'Title of your push notification',
    text: 'notification',
    sound: "default",
    badge: 1
  }
};
